import React, { useState, useEffect, useMemo, useReducer } from "react";
import { VStack, Button, useToast, StackDivider, Box, Heading, Text } from "@chakra-ui/react";
import { FaMicrophone } from "react-icons/fa";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import CountDisplay from "../components/CountDisplay";

const Index = () => {
  console.log("Index component rendering");
  const recognition = useMemo(() => new (window.SpeechRecognition || window.webkitSpeechRecognition)(), []);
  console.log("Recognition State:", recognition);
  const [sessionCounts, setSessionCounts] = useState({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
  console.log("Session Counts State:", sessionCounts);
  const [cumulativeCounts, setCumulativeCounts] = useState(() => {
    const savedCounts = localStorage.getItem("cumulativeTally");
    if (savedCounts) {
      try {
        return JSON.parse(savedCounts);
      } catch (e) {
        console.error("Error parsing cumulativeTally from localStorage:", e);
        return { PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 };
      }
    } else {
      return { PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cumulativeTally", JSON.stringify(cumulativeCounts));
    } catch (e) {
      console.error("Error saving cumulativeTally to localStorage:", e);
      toast({
        title: "Storage Error",
        description: "Failed to save data to local storage.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [cumulativeCounts]);
  console.log("Cumulative Counts State:", cumulativeCounts);
  const [isRecording, setIsRecording] = useReducer((state) => !state, false);
  console.log("Is Recording State:", isRecording);
  const toast = useToast();

  useEffect(() => {
    console.log("Index component mounted");
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

    let recognitionInstance;
    try {
      recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";
      recognitionInstance.onresult = handleResult;
      recognitionInstance.onerror = handleError;
      // This line is removed as recognition is now a memoized value, not set via useState
    } catch (error) {
      console.error("Speech Recognition setup failed:", error);
      toast({
        title: "Setup Error",
        description: "Failed to set up speech recognition.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
        recognitionInstance.onresult = null;
        recognitionInstance.onerror = null;
        console.log("Cleanup: Removed event listeners and stopped recognition to prevent state updates after unmount.");
      }
    };
  }, [toast]);

  const handleResult = (event) => {
    const lastResult = event.results[event.resultIndex];
    if (lastResult.isFinal) {
      const transcript = lastResult[0].transcript.trim().toLowerCase();
      const detectedCounts = detectKeywordsCustom(transcript);
      setSessionCounts((prevCounts) => {
        const updatedCounts = { ...prevCounts };
        Object.keys(detectedCounts).forEach((key) => {
          updatedCounts[key] = (updatedCounts[key] || 0) + detectedCounts[key];
        });
        return updatedCounts;
      });
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

  function detectKeywordsCustom(text) {
    const keywords = ["pet", "hdp", "can", "glass", "carton"];
    const words = text.toLowerCase().split(/\s+/);
    return words.reduce((acc, word) => {
      if (keywords.includes(word)) {
        acc[word] = (acc[word] || 0) + 1;
      }
      return acc;
    }, {});
  }

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

      setCumulativeCounts((prevCumulative) => ({
        ...prevCumulative,
        ...sessionCounts,
      }));

      setSessionCounts({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
    }
  };

  const resetSessionCounts = () => {
    console.log("Resetting session counts.");
    setSessionCounts({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
  };

  const resetCumulativeCounts = () => {
    console.log("Resetting cumulative counts.");
    setCumulativeCounts({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
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

  const installPWA = () => {
    let deferredPrompt;
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        deferredPrompt = null;
      });
    });
  };

  console.log("Session Counts:", sessionCounts);
  console.log("Cumulative Counts:", cumulativeCounts);
  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <CountDisplay sessionCounts={sessionCounts} cumulativeCounts={cumulativeCounts} />
      <Button onClick={startRecording} colorScheme={isRecording ? "orange" : "green"} leftIcon={<FaMicrophone />}>
        {isRecording ? "Pause Recording" : "Start Recording"}
      </Button>
      <CountDisplay cumulativeCounts={cumulativeCounts} />
      <Button onClick={resetSessionCounts} colorScheme="yellow">
        Reset Session Counts
      </Button>
      <Button onClick={resetCumulativeCounts} colorScheme="orange">
        Reset Cumulative Counts
      </Button>
      <Button onClick={handleDownloadCSV} colorScheme="blue">
        Download CSV
      </Button>
      <Button onClick={installPWA} colorScheme="purple">
        Install App
      </Button>
    </VStack>
  );
};

export default Index;
