import { Box, Button, Text, VStack, useToast } from "@chakra-ui/react";
import { FaMicrophone, FaRedo } from "react-icons/fa";
import { useState, useEffect } from "react";

const Index = () => {
  const [itemCounts, setItemCounts] = useState({
    PET: 0,
    HDP: 0,
    Can: 0,
    Glass: 0,
    Carton: 0,
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
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        detectKeywords(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startRecording = () => {
    if (recognition) {
      setIsRecording(true);
      recognition.start();
      toast({
        title: "Recording started",
        description: "Start counting aloud.",
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
        title: "Recording stopped",
        description: "Counting session ended and cumulative tally updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const detectKeywords = (transcript) => {
    const keywords = transcript.toLowerCase().split(" ");
    const updatedCounts = { ...itemCounts };

    keywords.forEach((keyword) => {
      if (keyword === "pet") {
        updatedCounts.PET++;
      } else if (keyword === "hdp") {
        updatedCounts.HDP++;
      } else if (keyword === "can") {
        updatedCounts.Can++;
      } else if (keyword === "glass") {
        updatedCounts.Glass++;
      } else if (keyword === "carton") {
        updatedCounts.Carton++;
      }
    });

    setItemCounts(updatedCounts);
    localStorage.setItem("tallyLog", JSON.stringify(updatedCounts));
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
      title: "Count reset",
      description: "You can start over.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const resetCumulativeTally = () => {
    setCumulativeTally(0);
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

  const handleVoiceCommand = (command) => {
    try {
      switch (command) {
        case "start":
          startRecording();
          break;
        case "stop":
          stopRecording();
          break;
        case "pause":
          pauseRecording();
          break;
        default:
          toast({
            title: "Unrecognized command",
            description: "Please say 'start', 'stop', or 'pause'.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
      }
    } catch (error) {
      console.error("Error handling voice command:", error);
    }
  };

  useEffect(() => {
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
    setItemCounts((prevCounts) => ({
      ...prevCounts,
      [type]: prevCounts[type] + 1,
    }));
  };

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <Button onClick={installPWA} colorScheme="teal" size="lg" m={4}>
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
        <Button onClick={pauseRecording} colorScheme="yellow" m={2}>
          Pause
        </Button>
        <Button onClick={() => exportData("cumulative")} colorScheme="green" m={2}>
          Export Cumulative Data
        </Button>
        <Button onClick={resetCumulativeTally} colorScheme="red" m={2}>
          Reset Cumulative
        </Button>
        <Button onClick={startRecording} colorScheme="green" m={2}>
          Start
        </Button>
        <Button onClick={stopRecording} colorScheme="red" m={2}>
          Stop
        </Button>
        <Button onClick={pauseRecording} colorScheme="yellow" m={2}>
          Pause
        </Button>
        <VStack>
          <Text>Cumulative Tally:</Text>
          <Text>PET: {cumulativeTally.PET}</Text>
          <Text>HDP: {cumulativeTally.HDP}</Text>
          <Text>Can: {cumulativeTally.Can}</Text>
          <Text>Glass: {cumulativeTally.Glass}</Text>
          <Text>Carton: {cumulativeTally.Carton}</Text>
        </VStack>
        <Button onClick={() => exportData("cumulative")} colorScheme="green" m={2}>
          Export Cumulative Data
        </Button>
        <Button onClick={resetCumulativeTally} colorScheme="red" m={2}>
          Reset Cumulative
        </Button>
      </Box>
    </VStack>
  );
};
export default Index;
