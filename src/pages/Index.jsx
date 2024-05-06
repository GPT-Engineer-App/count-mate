import React, { useState, useEffect, useReducer } from "react";
import { VStack, Button, useToast, StackDivider, Box, Heading, Text } from "@chakra-ui/react";
import { FaMicrophone } from "react-icons/fa";

// Define the initial state and reducer for managing counts
const initialState = {
    PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0
};
function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { ...state, [action.keyword]: state[action.keyword] + 1 };
        default:
            return state;
    }
}

const Index = () => {
    const [recognition, setRecognition] = useState(null);
    const [sessionCounts, dispatch] = useReducer(reducer, initialState);
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
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = "en-US";
        recognitionInstance.onresult = handleResult;
        recognitionInstance.onerror = handleError;
        setRecognition(recognitionInstance);

        return () => recognitionInstance.stop(); // Cleanup on unmount
    }, [toast]);

    const handleResult = (event) => {
        const lastResult = event.results[event.resultIndex];
        if (lastResult.isFinal) {
            const transcript = lastResult[0].transcript.trim().toLowerCase();
            const words = transcript.split(/\s+/);
            detectKeywords(words);
        }
    };

    const detectKeywords = (words) => {
        const keywordRegexes = {
            PET: /\bpet\b/,
            HDP: /\bhdp\b/,
            Can: /\bcan\b/,
            Glass: /\bglass\b/,
            Carton: /\bcarton\b/
        };
        words.forEach(word => {
            Object.keys(keywordRegexes).forEach(keyword => {
                if (keywordRegexes[keyword].test(word)) {
                    dispatch({ type: 'increment', keyword });
                }
            });
        });
    };

    const handleError = (event) => {
        console.error("Speech Recognition Error:", event.error);
        toast({
            title: "Recognition Error",
            description: `Error occurred: ${event.error}. Please try restarting the recognition.`,
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    };

    // Display active listening status
    const handleRecordingToggle = () => {
        setIsRecording(!isRecording);
        isRecording ? recognition.stop() : recognition.start();
    };

    return (
        <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4} align="stretch">
            <Box>
                <Heading mb={4}>Speech Recognition Tally</Heading>
                <Text>Listening Status: {isRecording ? "Active" : "Inactive"}</Text>
                <Button leftIcon={<FaMicrophone />} colorScheme="pink" onClick={handleRecordingToggle}>
                    {isRecording ? "Stop Listening" : "Start Listening"}
                </Button>
            </Box>
            <CountDisplay counts={sessionCounts} />
        </VStack>
    );
};

export default Index;
