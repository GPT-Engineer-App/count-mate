// Complete the Index page component here
// Use chakra-ui
import { Box, Button, Text, VStack, useToast } from "@chakra-ui/react";
import { FaMicrophone, FaPause, FaPlay, FaRedo, FaStop } from "react-icons/fa";

const Index = () => {
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
