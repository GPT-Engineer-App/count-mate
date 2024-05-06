import React from "react";
import { Text, Button } from "@chakra-ui/react";
import MicrophoneButton from "./MicrophoneButton";
import useSpeechRecognition from "./useSpeechRecognition";

const SpeechRecognitionInterface = () => {
  const { transcript, setTranscript, startRecording, stopRecording, isRecording } = useSpeechRecognition();

  return (
    <>
      <MicrophoneButton isRecording={isRecording} startRecording={startRecording} stopRecording={stopRecording} />
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

export default SpeechRecognitionInterface;
