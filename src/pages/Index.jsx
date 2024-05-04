import { Box, Button, Text, VStack, useToast } from "@chakra-ui/react";
import { FaMicrophone, FaRedo } from "react-icons/fa";
import { useState, useEffect } from "react";

const Index = () => {
  const [itemCounts, setItemCounts] = useState({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
  const [cumulativeCount, setCumulativeCount] = useState(0);

  const resetCumulativeCount = () => {
    setCumulativeCount(0);
  };

  const exportCumulativeData = () => {
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const csvContent = `data:text/csv;charset=utf-8,Cumulative Count,${cumulativeCount}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cdscount-${formattedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      const total = Object.values(itemCounts).reduce((acc, curr) => acc + curr, 0);
      setCumulativeCount((prev) => prev + total);
    }
  };
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
    const csvContent = `data:text/csv;charset=utf-8,PET,${itemCounts.PET}\nHDP,${itemCounts.HDP}\nCan,${itemCounts.Can}\nGlass,${itemCounts.Glass}\nCarton,${itemCounts.Carton}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tally_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <Button leftIcon={<FaMicrophone />} colorScheme={isRecording ? "red" : "blue"} onClick={isRecording ? pauseRecording : startRecording} m={2}>
          {isRecording ? "Pause" : "Start"}
        </Button>
        <Button leftIcon={<FaRedo />} colorScheme="red" onClick={resetCumulativeCount} m={2}>
          Reset Cumulative Count
        </Button>
        <Button onClick={() => exportCumulativeData()} colorScheme="green" m={2}>
          Export Cumulative Data
        </Button>
      </Box>
    </VStack>
  );
};

export default Index;
