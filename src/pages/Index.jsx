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
      toast({
        title: "Recording stopped",
        description: "Counting session ended.",
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

  const incrementCount = (type) => {
    setItemCounts((prevCounts) => ({
      ...prevCounts,
      [type]: prevCounts[type] + 1,
    }));
  };

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
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
        <Button leftIcon={<FaMicrophone />} colorScheme={isRecording ? "red" : "blue"} onClick={isRecording ? stopRecording : startRecording} m={2}>
          {isRecording ? "Stop" : "Start"}
        </Button>
        <Button leftIcon={<FaRedo />} colorScheme="red" onClick={resetCount} m={2}>
          Reset
        </Button>
      </Box>
    </VStack>
  );
};

export default Index;
