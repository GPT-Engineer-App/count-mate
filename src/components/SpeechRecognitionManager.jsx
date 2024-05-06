import React, { useEffect, useState } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { Button, useToast } from "@chakra-ui/react";
import { FaMicrophone } from "react-icons/fa";

const SpeechRecognitionManager = () => {
  const { recognition, isRecording, startRecording, stopRecording, transcript, setTranscript } = useSpeechRecognition();
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
      <Button mt={2} colorScheme="red" onClick={() => setTranscript("")}>
        Correct
      </Button>
    </>
  );
};

export default SpeechRecognitionManager;
