import React, { useEffect, useState } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { Box, Button, useToast } from "@chakra-ui/react";
import { FaMicrophone } from "react-icons/fa";

const SpeechRecognitionManager = () => {
  const { recognition, isRecording, startRecording, stopRecording, transcript, setTranscript } = useSpeechRecognition();
  const [volume, setVolume] = useState(0);
  const toast = useToast();

  useEffect(() => {
    if (!recognition) {
      toast({
        title: "Unsupported Feature",
        description: "Speech recognition is not supported by your browser.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [recognition, toast]);

  return (
    <>
      <Button onClick={isRecording ? stopRecording : startRecording} colorScheme={isRecording ? "red" : "green"} leftIcon={<FaMicrophone />}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      <Text mt={4}>{transcript}</Text>
      <Button mt={2} colorScheme="blue" onClick={() => setTranscript("")}>
        Accept
      </Button>
      <Box position="relative" w="full" h="10px" bg="gray.200">
        <Box position="absolute" w={`${volume * 100}%`} h="full" bg="green.400" />
      </Box>
      <Button mt={2} colorScheme="red" onClick={() => setTranscript("")}>
        Correct
      </Button>
      <Button
        mt={2}
        colorScheme="blue"
        onClick={() => {
          setTranscript("");
          recognition.resetSessionCounts();
        }}
      >
        Reset
      </Button>
    </>
  );
};

export default SpeechRecognitionManager;
