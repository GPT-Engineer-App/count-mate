import { useState, useEffect } from 'react';
import { Box, Button, Text, VStack, useToast } from "@chakra-ui/react";
import { FaMicrophone, FaRedo } from "react-icons/fa";

const Index = () => {
  const [itemCounts, setItemCounts] = useState({
    PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join("");
        handleVoiceCommand(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startRecording = () => {
    if (recognition && !isRecording) {
      setIsRecording(true);
      recognition.start();
      toast({
        title: "Recording started",
        description: "Voice commands are now active.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      setIsRecording(false);
      recognition.stop();
      toast({
        title: "Recording stopped",
        description: "Voice commands are now inactive.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleVoiceCommand = (transcript) => {
    const trimmedCommand = transcript.trim().toLowerCase();
    const controlCommands = ['stop', 'pause', 'resume'];

    if (controlCommands.includes(trimmedCommand)) {
      switch (trimmedCommand) {
        case "stop":
          stopRecording();
          break;
        case "pause":
          if (recognition && isRecording) {
            setIsRecording(false);
            recognition.stop();
            toast({
              title: "Recording paused",
              description: "You can resume anytime.",
              status: "warning",
              duration: 3000,
              isClosable: true,
            });
          }
          break;
        case "resume":
          if (recognition && !isRecording) {
            setIsRecording(true);
            recognition.start();
            toast({
              title: "Recording resumed",
              description: "Continue counting aloud.",
              status: "info",
              duration: 3000,
              isClosable: true,
            });
          }
          break;
      }
    } else {
      detectKeywords(trimmedCommand);
    }
  };

  const detectKeywords = (keyword) => {
    const updatedCounts = { ...itemCounts };
    if (Object.keys(itemCounts).includes(keyword)) {
      updatedCounts[keyword]++;
      setItemCounts(updatedCounts);
      localStorage.setItem("tallyLog", JSON.stringify(updatedCounts));
    }
  };

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <Button onClick={startRecording} leftIcon={<FaMicrophone />} colorScheme="green">
        Start Voice Commands
      </Button>
      {}
    </VStack>
  );
};

export default Index;
