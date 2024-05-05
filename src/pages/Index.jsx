import React, { useState, useEffect } from "react";
import { VStack, Button, Text, useToast } from "@chakra-ui/react";
import { FaMicrophone } from "react-icons/fa";

const Index = () => {
  const [recognition, setRecognition] = useState(null);
  const [sessionCounts, setSessionCounts] = useState({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
  const [cumulativeCounts, setCumulativeCounts] = useState(() => {
    const savedCounts = localStorage.getItem("cumulativeTally");
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
      detectKeywords(transcript);
    }
  };

  const handleError = (event) => {
    toast({
      title: "Recognition Error",
      description: `Error occurred: ${event.error}`,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const detectKeywords = (transcript) => {
    const keywordRegex = /\b(pet|hdp|can|glass|carton)\b/g;
    const matches = transcript.match(keywordRegex);
    if (matches && matches.length) {
      const updatedSessionCounts = { ...sessionCounts };
      const updatedCumulativeCounts = { ...cumulativeCounts };
      matches.forEach((keyword) => {
        updatedSessionCounts[keyword]++;
        updatedCumulativeCounts[keyword]++;
      });
      setSessionCounts(updatedSessionCounts);
      setCumulativeCounts(updatedCumulativeCounts);
      localStorage.setItem("cumulativeTally", JSON.stringify(updatedCumulativeCounts));
      toast({
        title: "Keyword Detected",
        description: `Updated counts for ${matches.join(", ")}.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "No Keywords Detected",
        description: "No valid keywords detected in the last speech segment.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const startRecording = () => {
    if (recognition && !isRecording) {
      recognition.start();
      setIsRecording(true);
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
      recognition.stop();
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "The session has ended and data has been saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const resetSessionCounts = () => {
    setSessionCounts({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
    toast({
      title: "Session Counts Reset",
      description: "All session tallies have been reset.",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
  };

  const resetCumulativeCounts = () => {
    setCumulativeCounts({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
    toast({
      title: "Cumulative Counts Reset",
      description: "All cumulative tallies have been reset.",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <Button onClick={startRecording} colorScheme={isRecording ? "red" : "green"} leftIcon={<FaMicrophone />}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      <Button onClick={resetSessionCounts} colorScheme="yellow">
        Reset Session Counts
      </Button>
      <Button onClick={resetCumulativeCounts} colorScheme="orange">
        Reset Cumulative Counts
      </Button>
      <Button onClick={() => console.log("Download CSV functionality not implemented yet")} colorScheme="blue">
        Download CSV
      </Button>
      <Text>Session Counts: {JSON.stringify(sessionCounts)}</Text>
      <Text>Cumulative Counts: {JSON.stringify(cumulativeCounts)}</Text>
    </VStack>
  );
};

export default Index;
