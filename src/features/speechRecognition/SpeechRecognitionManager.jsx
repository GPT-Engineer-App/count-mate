import React from "react";
import { Text, Button, useToast } from "@chakra-ui/react";
import MicrophoneButton from "./MicrophoneButton";
import useSpeechRecognition from "./useSpeechRecognition";

const SpeechRecognitionManager = () => {
  const { transcript, setTranscript } = useSpeechRecognition();
  const toast = useToast();

  return (
    <>
      <MicrophoneButton />
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
