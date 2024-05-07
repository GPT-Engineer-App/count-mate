import React from "react";
import { Button } from "@chakra-ui/react";
import { FaMicrophone } from "react-icons/fa";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

const MicrophoneButton = () => {
  const { isRecording, startRecording, stopRecording } = useSpeechRecognition();

  return (
    <Button onClick={isRecording ? stopRecording : startRecording} colorScheme={isRecording ? "red" : "green"} leftIcon={<FaMicrophone color={isRecording ? "red" : "green"} />}>
      {isRecording ? "Stop" : "Start"}
    </Button>
  );
};

export default MicrophoneButton;
