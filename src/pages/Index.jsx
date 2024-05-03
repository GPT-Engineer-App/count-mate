// Complete the Index page component here
// Use chakra-ui
import { Box, Button, Text, VStack, useToast, Input, Container, Wrap, Badge, Progress } from "@chakra-ui/react";
import { FaMicrophone, FaPause, FaPlay, FaRedo, FaStop } from "react-icons/fa";
import { useState } from "react";

const Index = () => {
  // No change needed, confirming that state management is already set up for live updates
  const [pet, setPet] = useState(0);
  const [hdp, setHdp] = useState(0);
  const [can, setCan] = useState(0);
  const [glass, setGlass] = useState(0);
  const [carton, setCarton] = useState(0);
  const [currentCommand, setCurrentCommand] = useState("");
  const toast = useToast();

  // Simulated functions for voice commands
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startListening = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setMediaRecorder(new MediaRecorder(stream));
        mediaRecorder.start(5000);

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
          if (mediaRecorder.state === "recording" && chunks.length >= 5) {
            setRecordedChunks((prev) => [...prev, ...chunks]);
            chunks.length = 0;
          }
        };

        mediaRecorder.onstop = () => {
          setRecordedChunks((prev) => [...prev, ...chunks]);
        };

        setIsRecording(true);
        toast({
          title: "Recording started",
          description: "Microphone is active.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Error accessing the microphone: ", error);
        toast({
          title: "Error",
          description: "Failed to access the microphone.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const pauseListening = () => {
    toast({
      title: "Listening paused",
      description: "You can resume anytime.",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
  };

  const resumeListening = () => {
    toast({
      title: "Listening resumed",
      description: "Continue counting.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const resetCount = () => {
    setPet(0);
    setHdp(0);
    setCan(0);
    setGlass(0);
    setCarton(0);
    setCurrentCommand("reset");
    toast({
      title: "Count reset",
      description: "You can start over.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const [keywords, setKeywords] = useState([]);

  function prepareAudioData(recordedChunks) {
    const formData = new FormData();
    recordedChunks.forEach((chunk, index) => {
      formData.append(`audioChunk_${index}`, chunk, `chunk_${index}.mp3`);
    });
    return formData;
  }

  async function sendAudioData(formData) {
    try {
      const response = await fetch("/analyze-audio", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error sending audio data:", error);
      toast({
        title: "Error",
        description: "Failed to send audio data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const stopListening = async () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
      const formData = prepareAudioData(recordedChunks);
      const result = await sendAudioData(formData);
      if (result && result.keywords) {
        setKeywords(result.keywords);
        toast({
          title: "Analysis complete",
          description: "Keywords have been updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const incrementCount = (type) => {
    switch (type) {
      case "PET":
        setPet(pet + 1);
        break;
      case "HDP":
        setHdp(hdp + 1);
        break;
      case "Can":
        setCan(can + 1);
        break;
      case "Glass":
        setGlass(glass + 1);
        break;
      case "Carton":
        setCarton(carton + 1);
        break;
      default:
        break;
    }
    setCurrentCommand(`Incremented ${type}`);
  };

  return (
    <Container maxW="container.xl" p={5}>
      <VStack spacing={4} align="center" justify="center">
        <Text fontSize="2xl" fontWeight="bold">
          Bottle, Cans, and Glass Bottle Counting App
        </Text>
        <Container centerContent p={4} bg="gray.100" borderRadius="lg">
          <Input placeholder="Current Command" value={currentCommand} isReadOnly mt={4} mb={4} size="lg" focusBorderColor="blue.500" />
          <Text>PET: {pet}</Text>
          <Button onClick={() => incrementCount("PET")} size="lg" colorScheme="blue">
            Add PET
          </Button>
          <Text>HDP: {hdp}</Text>
          <Button onClick={() => incrementCount("HDP")} size="lg" colorScheme="blue">
            Add HDP
          </Button>
          <Text>Can: {can}</Text>
          <Button onClick={() => incrementCount("Can")} size="lg" colorScheme="blue">
            Add Can
          </Button>
          <Text>Glass: {glass}</Text>
          <Button onClick={() => incrementCount("Glass")} size="lg" colorScheme="blue">
            Add Glass
          </Button>
          <Text>Carton: {carton}</Text>
          <Button onClick={() => incrementCount("Carton")} size="lg" colorScheme="blue">
            Add Carton
          </Button>
        </Container>
        <Container centerContent p={4} bg="gray.200" borderRadius="lg">
          <Button leftIcon={<FaMicrophone />} colorScheme={isRecording ? "red" : "blue"} onClick={startListening} m={2} size="lg">
            {isRecording ? "Recording..." : "Start"}
          </Button>
          <Button leftIcon={<FaPause />} colorScheme="orange" onClick={pauseListening} m={2} size="lg">
            Pause
          </Button>
          <Button leftIcon={<FaPlay />} colorScheme="green" onClick={resumeListening} m={2} size="lg">
            Resume
          </Button>
          <Button leftIcon={<FaRedo />} colorScheme="red" onClick={resetCount} m={2} size="lg">
            Reset
          </Button>
          <Container centerContent p={4} bg="teal.100" borderRadius="lg" mt={4}>
            <Text mb={4} fontSize="lg" fontWeight="bold">
              Drag and drop your audio file here
            </Text>
            <Progress colorScheme="teal" size="xs" isIndeterminate />
          </Container>
          <Button leftIcon={<FaStop />} colorScheme="purple" onClick={stopListening} m={2} size="lg">
            Stop
          </Button>
          <Button
            colorScheme="red"
            onClick={() => {
              localStorage.removeItem("auth");
              window.location.reload();
            }}
            size="lg"
          >
            Logout
          </Button>
          <Wrap mt={4}>
            <Wrap mt={4}>
              {keywords.map((keyword, index) => (
                <Badge key={index} colorScheme="green" p={2} m={1} borderRadius="lg" fontSize="md" variant="solid">
                  {keyword}
                </Badge>
              ))}
            </Wrap>
          </Wrap>
        </Container>
      </VStack>
    </Container>
  );
};

export default Index;
