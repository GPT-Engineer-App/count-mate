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

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <Text fontSize="2xl" fontWeight="bold">
        Bottle, Cans, and Glass Bottle Counting App
      </Text>
      <Input placeholder="Current Command" value={currentCommand} isReadOnly mt={4} mb={4} />
      <Text>PET: {pet}</Text>
      <Text>HDP: {hdp}</Text>
      <Text>Can: {can}</Text>
      <Text>Glass: {glass}</Text>
      <Text>Carton: {carton}</Text>
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
      </Box>
    </VStack>
  );
};

export default Index;
