import { Box, Button, Text, VStack, useToast } from "@chakra-ui/react";
import { FaMicrophone, FaRedo } from "react-icons/fa";
import { useState, useEffect } from "react";

const Index = () => {
  const [itemCounts, setItemCounts] = useState(() => {
    const savedCounts = localStorage.getItem("tallyLog");
    return savedCounts ? JSON.parse(savedCounts) : { PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 };
  });
  const [isRecording, setIsRecording] = useState(false);
  const [cumulativeTally, setCumulativeTally] = useState({
    PET: 0,
    HDP: 0,
    Can: 0,
    Glass: 0,
    Carton: 0,
  });
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
        const lastResult = event.results[event.resultIndex];
        if (lastResult.isFinal) {
          handleVoiceCommand(lastResult[0].transcript.trim().toLowerCase());
        }
      };
      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        toast({
          title: "Recognition Error",
          description: `Error occurred: ${event.error}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      };
      setRecognition(recognitionInstance);
    } else {
      console.error("SpeechRecognition is not supported by this browser.");
      toast({
        title: "Unsupported Feature",
        description: "Speech recognition is not supported by your browser.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, []);

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
      setCumulativeTally((prevTally) => ({
        ...prevTally,
        PET: prevTally.PET + itemCounts.PET,
        HDP: prevTally.HDP + itemCounts.HDP,
        Can: prevTally.Can + itemCounts.Can,
        Glass: prevTally.Glass + itemCounts.Glass,
        Carton: prevTally.Carton + itemCounts.Carton,
      }));
      toast({
        title: "Recording Stopped",
        description: "The session has ended. Cumulative tally has been updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const detectKeywords = (transcript) => {
    console.log("Received transcript for processing:", transcript);

    const matches = transcript.toLowerCase().match(/\b(pet|hdp|can|glass|carton)\b/g) || [];
    console.log("Detected keywords:", matches);
    let updatesFound = false;
    const updatedCounts = { ...itemCounts };

    matches.forEach((keyword) => {
      if (["pet", "hdp", "can", "glass", "carton"].includes(keyword)) {
        updatedCounts[keyword]++;
        updatesFound = true;
        console.log(`Detected and updated count for ${keyword}`);
        toast({
          title: "Keyword Detected",
          description: `Counted additional ${keyword.toUpperCase()}.`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    });

    if (updatesFound) {
      console.log("Updates found, setting item counts and updating local storage.");
      setItemCounts((prevCounts) => {
        const newCounts = { ...prevCounts };
        Object.keys(updatedCounts).forEach((key) => {
          newCounts[key] = (prevCounts[key] || 0) + updatedCounts[key];
        });
        return newCounts;
      });
      localStorage.setItem("tallyLog", JSON.stringify(updatedCounts));
    } else {
      console.error("No valid keywords detected, tally not updated.");
      toast({
        title: "No Keywords Detected",
        description: "Please try speaking clearly.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const resetCount = () => {
    setItemCounts({
      PET: 0,
      HDP: 0,
      Can: 0,
      Glass: 0,
      Carton: 0,
    });
    toast({
      title: "Counts Reset",
      description: "All running tallies have been reset. You can start a new session.",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
  };

  const resetCumulativeTally = () => {
    setCumulativeTally({
      PET: 0,
      HDP: 0,
      Can: 0,
      Glass: 0,
      Carton: 0,
    });
    toast({
      title: "Cumulative tally reset",
      description: "Cumulative data has been cleared.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const installPWA = () => {
    try {
      if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the A2HS prompt");
          }
          window.deferredPrompt = null;
        });
      }
    } catch (error) {
      console.error("PWA installation failed:", error);
    }
  };

  const pauseRecording = () => {
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
  };

  const handleVoiceCommand = (transcript) => {
    const trimmedCommand = transcript.trim().toLowerCase();
    const controlCommands = ["start", "stop", "pause", "resume"];

    if (controlCommands.includes(trimmedCommand)) {
      switch (trimmedCommand) {
        case "start":
          startRecording();
          break;
        case "stop":
          stopRecording();
          break;
        case "pause":
          pauseRecording();
          break;
        case "resume":
          resumeRecording();
          break;
      }
    } else {
      detectKeywords(trimmedCommand);
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition is not supported by this browser.");
      return;
    }
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";
      recognitionInstance.onresult = (event) => {
        const lastResult = event.results[event.resultIndex];
        if (lastResult.isFinal) {
          handleVoiceCommand(lastResult[0].transcript.trim().toLowerCase());
        }
      };
      setRecognition(recognitionInstance);
    }
  }, []);

  const resumeRecording = () => {
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
  };

  useEffect(() => {
    console.log("Updated item counts:", itemCounts);
    localStorage.setItem("tallyLog", JSON.stringify(itemCounts));
  }, [itemCounts]);

  const exportData = () => {
    try {
      const csvContent = `data:text/csv;charset=utf-8,PET,${itemCounts.PET}\nHDP,${itemCounts.HDP}\nCan,${itemCounts.Can}\nGlass,${itemCounts.Glass}\nCarton,${itemCounts.Carton}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "tally_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to export data:", error);
    }
  };

  const incrementCount = (type) => {
    setItemCounts((prevCounts) => {
      return {
        ...prevCounts,
        [type]: prevCounts[type] + 1,
      };
    });
  };

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <Button onClick={installPWA} colorScheme="teal" size="lg" m={4} isDisabled={!window.deferredPrompt}>
        Install PWA
      </Button>
      <Text fontSize="2xl" fontWeight="bold">
        Bottle, Cans, and Glass Bottle Counting App
      </Text>
      <Box>
        <Text>PET: {itemCounts.PET}</Text>
        <Button onClick={() => incrementCount("PET")} size="lg" colorScheme="blue">
          Add PET
        </Button>
        <Text>HDP: {itemCounts.HDP}</Text>
        <Button onClick={() => incrementCount("HDP")} size="lg" colorScheme="blue">
          Add HDP
        </Button>
        <Text>Can: {itemCounts.Can}</Text>
        <Button onClick={() => incrementCount("Can")} size="lg" colorScheme="blue">
          Add Can
        </Button>
        <Text>Glass: {itemCounts.Glass}</Text>
        <Button onClick={() => incrementCount("Glass")} size="lg" colorScheme="blue">
          Add Glass
        </Button>
        <Text>Carton: {itemCounts.Carton}</Text>
        <Button onClick={() => incrementCount("Carton")} size="lg" colorScheme="blue">
          Add Carton
        </Button>
      </Box>
      <Box>
        <Button leftIcon={<FaMicrophone />} colorScheme={isRecording ? "red" : "blue"} onClick={isRecording ? pauseRecording : resumeRecording} m={2}>
          {isRecording ? "Pause" : "Resume"}
        </Button>

        <Button onClick={startRecording} colorScheme="green" m={2}>
          Start
        </Button>
        <Button onClick={stopRecording} colorScheme="red" m={2}>
          Stop
        </Button>
        <Button onClick={startRecording} colorScheme="green" m={2}>
          Start
        </Button>
        <Button onClick={stopRecording} colorScheme="red" m={2}>
          Stop
        </Button>
        <Button leftIcon={<FaMicrophone />} colorScheme={isRecording ? "red" : "blue"} onClick={isRecording ? pauseRecording : resumeRecording} m={2}>
          {isRecording ? "Pause" : "Resume"}
        </Button>
      </Box>
    </VStack>
  );
};
export default Index;
