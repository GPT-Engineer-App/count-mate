import React, { useState, useEffect, useMemo, useReducer } from "react";
import { VStack, Button, useToast, StackDivider, Box, Heading, Text } from "@chakra-ui/react";
import { FaMicrophone } from "react-icons/fa";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import CountDisplay from "../components/CountDisplay";

const Index = () => {
  console.log("Index component rendering");
  const recognition = useMemo(() => new (window.SpeechRecognition || window.webkitSpeechRecognition)(), []);
  console.log("Recognition State:", recognition);
  const [counts, setCounts] = useState(() => {
    const savedCounts = localStorage.getItem("cumulativeTally");
    return savedCounts ? JSON.parse(savedCounts) : { PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 };
  });
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

  const handleResult = (event) => {
    const lastResult = event.results[event.resultIndex];
    if (lastResult.isFinal) {
      const transcript = lastResult[0].transcript.trim().toLowerCase();
      const detectedCounts = detectKeywordsCustom(transcript);
      setCounts((prevCounts) => {
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
    }
  };

  const resetCounts = () => {
    console.log("Resetting counts.");
    setCounts({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
  };

  const handleDownloadCSV = () => {
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
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

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <CountDisplay counts={counts} />
      <Button onClick={startRecording} colorScheme={isRecording ? "orange" : "green"} leftIcon={<FaMicrophone />}>
        {isRecording ? "Pause Recording" : "Start Recording"}
      </Button>
      <Button onClick={resetCounts} colorScheme="yellow">
        Reset Counts
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
