import React, { useState, useEffect } from "react";
import { VStack, Button, useToast, StackDivider, Box, Heading, Text } from "@chakra-ui/react";
import { FaMicrophone } from "react-icons/fa";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import CountDisplay from "../components/CountDisplay";

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
    console.error("Speech Recognition Error:", event.error);
    toast({
      title: "Recognition Error",
      description: `An error occurred during speech recognition: ${event.error}`,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const detectKeywords = (transcript) => {
    const keywordRegex = /\b(pet|hdp|can|glass|carton)\b/gi;
    const matches = transcript.match(keywordRegex);
    if (matches && matches.length) {
      setSessionCounts((prevCounts) => {
        const updatedCounts = { ...prevCounts };
        matches.forEach((keyword) => {
          updatedCounts[keyword] = (updatedCounts[keyword] || 0) + 1;
        });
        return updatedCounts;
      });

      setCumulativeCounts((prevCounts) => {
        const updatedCounts = { ...prevCounts };
        matches.forEach((keyword) => {
          updatedCounts[keyword] = (updatedCounts[keyword] || 0) + 1;
        });
        return updatedCounts;
      });
      localStorage.setItem("cumulativeTally", JSON.stringify(cumulativeCounts));
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
    setIsRecording((prevIsRecording) => {
      if (recognition) {
        if (!prevIsRecording) {
          recognition.start();
          console.log("Recording started.");
          toast({
            title: "Recording Started",
            description: "You may start speaking your counts now.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        } else {
          recognition.stop();
          console.log("Recording paused.");
          toast({
            title: "Recording Paused",
            description: "Speech recognition paused.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      }
      return !prevIsRecording;
    });
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
      console.log("Recording stopped.");
      toast({
        title: "Recording Stopped",
        description: "The session has ended.",
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

  const handleDownloadCSV = () => {
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    let downloadCount = parseInt(localStorage.getItem(formattedDate) || "0", 10) + 1;
    localStorage.setItem(formattedDate, downloadCount.toString());
    const filename = `${formattedDate}-CDS_Count-${downloadCount}.csv`;
    const csvContent = [["Material", "Count"], ...Object.entries(cumulativeCounts).map(([key, value]) => [key, value])].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <Button onClick={startRecording} colorScheme={isRecording ? "orange" : "green"} leftIcon={<FaMicrophone />}>
        {isRecording ? "Pause Recording" : "Start Recording"}
      </Button>
      <Button onClick={resetSessionCounts} colorScheme="yellow">
        Reset Session Counts
      </Button>
      <Button onClick={resetCumulativeCounts} colorScheme="orange">
        Reset Cumulative Counts
      </Button>
      <Button onClick={handleDownloadCSV} colorScheme="blue">
        Download CSV
      </Button>
      <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4} align="stretch">
        <Box p={5} shadow="md" borderWidth="1px">
          <Heading fontSize="xl">Session Counts</Heading>
          {Object.keys(sessionCounts).map((key) => (
            <Text key={key}>{`${key}: ${sessionCounts[key]}`}</Text>
          ))}
        </Box>
        <Box p={5} shadow="md" borderWidth="1px">
          <Heading fontSize="xl">Cumulative Counts</Heading>
          {Object.keys(cumulativeCounts).map((key) => (
            <Text key={key}>{`${key}: ${cumulativeCounts[key]}`}</Text>
          ))}
        </Box>
      </VStack>
    </VStack>
  );
};

export default Index;
