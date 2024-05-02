// Complete the Index page component here
// Use chakra-ui
import { Box, Button, Text, VStack, useToast, Input } from "@chakra-ui/react";
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
  const startListening = () => {
    toast({
      title: "Listening started",
      description: "Start counting aloud.",
      status: "info",
      duration: 3000,
      isClosable: true,
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

  const stopListening = () => {
    toast({
      title: "Listening stopped",
      description: "Counting session ended.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
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
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <Text fontSize="2xl" fontWeight="bold">
        Bottle, Cans, and Glass Bottle Counting App
      </Text>
      <Input placeholder="Current Command" value={currentCommand} isReadOnly mt={4} mb={4} />
      <Text>PET: {pet}</Text>
      <Button onClick={() => incrementCount("PET")}>Add PET</Button>
      <Text>HDP: {hdp}</Text>
      <Button onClick={() => incrementCount("HDP")}>Add HDP</Button>
      <Text>Can: {can}</Text>
      <Button onClick={() => incrementCount("Can")}>Add Can</Button>
      <Text>Glass: {glass}</Text>
      <Button onClick={() => incrementCount("Glass")}>Add Glass</Button>
      <Text>Carton: {carton}</Text>
      <Button onClick={() => incrementCount("Carton")}>Add Carton</Button>
      <Box>
        <Button leftIcon={<FaMicrophone />} colorScheme="blue" onClick={startListening} m={2}>
          Start
        </Button>
        <Button leftIcon={<FaPause />} colorScheme="orange" onClick={pauseListening} m={2}>
          Pause
        </Button>
        <Button leftIcon={<FaPlay />} colorScheme="green" onClick={resumeListening} m={2}>
          Resume
        </Button>
        <Button leftIcon={<FaRedo />} colorScheme="red" onClick={resetCount} m={2}>
          Reset
        </Button>
        <Button leftIcon={<FaStop />} colorScheme="purple" onClick={stopListening} m={2}>
          Stop
        </Button>
        <Button
          colorScheme="red"
          onClick={() => {
            localStorage.removeItem("auth");
            window.location.reload();
          }}
        >
          Logout
        </Button>
      </Box>
    </VStack>
  );
};

export default Index;
