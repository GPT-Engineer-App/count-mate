import React, { useState, useEffect, useMemo, useReducer } from "react";
import { VStack, HStack, Button, useToast, StackDivider, Box, Heading, Text, Spacer, Collapse, useDisclosure } from "@chakra-ui/react";
import { FaMicrophone } from "react-icons/fa";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import CountDisplay from "../components/CountDisplay";
import MicrophoneButton from "../components/MicrophoneButton";

const Index = () => {
  console.log("Index component rendering");
  const recognition = useMemo(() => new (window.SpeechRecognition || window.webkitSpeechRecognition)(), []);
  console.log("Recognition State:", recognition);
  const [counts, setCounts] = useState(() => {
    const savedCounts = localStorage.getItem("cumulativeTally");
    return savedCounts ? JSON.parse(savedCounts) : { pet: 0, hdp: 0, can: 0, glass: 0, carton: 0 };
  });
  const [cumulativeCounts, setCumulativeCounts] = useState(() => {
    const savedCumulativeCounts = localStorage.getItem("dailyTally");
    return savedCumulativeCounts ? JSON.parse(savedCumulativeCounts) : { pet: 0, hdp: 0, can: 0, glass: 0, carton: 0 };
  });
  const sessionCounts = counts;
  console.log("Counts State:", counts);

  useEffect(() => {
    try {
      localStorage.setItem("cumulativeTally", JSON.stringify(counts));
    } catch (e) {
      console.error("Error saving counts to localStorage:", e);
      toast({
        title: "Storage Error",
        description: "Failed to save data to local storage.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [counts]);
  console.log("Counts State:", counts);
  const { isOpen, onToggle } = useDisclosure();
  const [isRecording, setIsRecording] = useReducer((state) => !state, false);
  console.log("Is Recording State:", isRecording);
  const toast = useToast();

  const promptPWAInstallation = () => {
    let deferredPrompt;
    // Removed to prevent potential memory leak by adding multiple event listeners

    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        deferredPrompt = null;
      });
    }
  };

  // This function is now handled in the useSpeechRecognition hook and updates are directly made to sessionCounts

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

  function detectKeywordsCustom(text) {
    const keywords = ["pet", "high-density polyethylene", "can", "glass", "carton"];
    const words = text.toLowerCase().split(/\s+/);
    return words.reduce((acc, word) => {
      if (keywords.includes(word)) {
        acc[word] = (acc[word] || 0) + 1;
      }
      return acc;
    }, {});
  }

  const pauseRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
      console.log("Recording paused.");
      toast({
        title: "Recording Paused",
        description: "Speech recognition paused.",
        status: "info",
        duration: 3000,
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

  const abortRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
      console.log("Recording aborted.");
      toast({
        title: "Recording Aborted",
        description: "Speech recognition aborted.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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

  const calculateAverageCountPerMinute = (counts) => {
    const totalMinutes = (new Date() - new Date().setHours(0, 0, 0, 0)) / 60000;
    const totalCount = Object.values(counts).reduce((total, num) => total + num, 0);
    return (totalCount / totalMinutes).toFixed(2);
  };

  const resetCounts = (type) => {
    if (type === "cumulative") {
      console.log("Resetting cumulative counts.");
      setCounts({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
    } else if (type === "session") {
      console.log("Resetting session counts.");
    }
  };

  const pushCount = () => {
    console.log("Pushing cumulative counts to session.");
  };

  const handleDownloadCSV = () => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
    let downloadCount = parseInt(localStorage.getItem(formattedDate) || "0", 10) + 1;
    localStorage.setItem(formattedDate, downloadCount.toString());
    const filename = `${formattedDate}-CDS_Count-${downloadCount}.csv`;
    const csvContent = [["Material", "Count"], ...Object.entries(counts).map(([key, value]) => [key, value])].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const installPWA = () => {
    let deferredPrompt;
    const triggerPWAInstallation = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the A2HS prompt");
          } else {
            console.log("User dismissed the A2HS prompt");
          }
          deferredPrompt = null;
        });
      }
    };
  };

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <CountDisplay counts={counts} title="Current Session Counts">
        {Object.keys(counts).map((key) => (
          <HStack key={key} spacing={2}>
            <Button colorScheme="blue" onClick={() => setCounts((prev) => ({ ...prev, [key]: prev[key] + 1 }))}>
              Increment
            </Button>
            <Button colorScheme="blue" onClick={() => setCounts((prev) => ({ ...prev, [key]: prev[key] + 2 }))}>
              Increment x2
            </Button>
          </HStack>
        ))}
      </CountDisplay>
      <HStack justify="space-between" width="full" mb={4} align="center" justify="center">
        <Button colorScheme="green" onClick={startRecording}>
          Start
        </Button>
        <Button colorScheme="yellow" onClick={pauseRecording} isDisabled={!isRecording}>
          Pause
        </Button>
        <Button colorScheme="red" onClick={stopRecording} isDisabled={!isRecording}>
          Stop
        </Button>
        <Button colorScheme="blue" onClick={resetCounts}>
          Reset
        </Button>
        <Button colorScheme="blue" onClick={handleDownloadCSV}>
          Download CSV
        </Button>
      </HStack>
      <Box position="relative" width="100%">
        <Button onClick={onToggle} position="absolute" bottom="0" left="0">
          Settings
        </Button>
        <Collapse in={isOpen} animateOpacity>
          <VStack position="absolute" bottom="0" left="0" right="0" bg="gray.800" p={4} rounded="md" shadow="md" transform="translateY(100%)" transition="transform 0.3s ease-in-out">
            {}
          </VStack>
        </Collapse>
      </Box>
      <CountDisplay counts={counts} title="Statistics" />
    </VStack>
  );
};

export default Index;
