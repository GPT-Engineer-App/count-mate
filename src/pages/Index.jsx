import React, { useState, useEffect } from 'react';
import { Box, Button, Text, VStack, useToast } from "@chakra-ui/react";
import { FaMicrophone, FaRedo } from "react-icons/fa";

const Index = () => {
    const [recognition, setRecognition] = useState(null);
    const [itemCounts, setItemCounts] = useState(() => {
        const savedCounts = localStorage.getItem("tallyLog");
        return savedCounts ? JSON.parse(savedCounts) : { PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 };
    });
    const [isRecording, setIsRecording] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast({
                title: "Unsupported Feature",
                description: "Speech recognition is not supported by your browser.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = "en-US";
        recognitionInstance.onresult = (event) => {
            const lastResult = event.results[event.resultIndex];
            if (lastResult.isFinal) {
                detectKeywords(lastResult[0].transcript.trim().toLowerCase());
            }
        };
        recognitionInstance.onerror = (event) => {
            toast({
                title: "Recognition Error",
                description: `Error occurred: ${event.error}`,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        };
        setRecognition(recognitionInstance);
    }, [toast]);

    const startRecording = () => {
        if (recognition) {
            setIsRecording(true);
            recognition.start();
            toast({
                title: "Recording Started",
                description: "You may start speaking your counts now.",
                status: "info",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const stopRecording = () => {
        if (recognition) {
            setIsRecording(false);
            recognition.stop();
            toast({
                title: "Recording Stopped",
                description: "The session has ended.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const detectKeywords = (transcript) => {
        const keywords = /\b(pet|hdp|can|glass|carton)\b/g;
        const matches = transcript.match(keywords) || [];
        const updatedCounts = { ...itemCounts };
        matches.forEach(keyword => {
            updatedCounts[keyword] = (updatedCounts[keyword] || 0) + 1;
        });
        setItemCounts(updatedCounts);
        localStorage.setItem("tallyLog", JSON.stringify(updatedCounts));
        toast({
            title: "Keyword Detected",
            description: `Counted additional ${matches.join(", ")}.`,
            status: "success",
            duration: 2000,
            isClosable: true,
        });
    };

    const resetCounts = () => {
        setItemCounts({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
        localStorage.setItem("tallyLog", JSON.stringify({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 }));
        toast({
            title: "Counts Reset",
            description: "All running tallies have been reset.",
            status: "warning",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <VStack spacing={4} align="center" justify="center" height="100vh">
            <Button onClick={startRecording} colorScheme="blue" leftIcon={<FaMicrophone />}>
                Start Recording
            </Button>
            <Button onClick={stopRecording} colorScheme="red" leftIcon={<FaRedo />}>
                Stop Recording
            </Button>
            <Button onClick={resetCounts} colorScheme="yellow">
                Reset Counts
            </Button>
        </VStack>
    );
};

export default Index;
