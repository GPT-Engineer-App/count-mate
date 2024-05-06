import React from "react";
import { Button } from "@chakra-ui/react";
import { FaMicrophone } from "react-icons/fa";
import useSpeechRecognition from "./useSpeechRecognition";

const MicrophoneButton = () => {
  const { isRecording, startRecording, stopRecording } = useSpeechRecognition();

  return (
    <Button onClick={isRecording ? stopRecording : startRecording} colorScheme={isRecording ? "red" : "green"} leftIcon={<FaMicrophone />}>
      {isRecording ? "Stop Recording" : "Start Recording"}
    </Button>
  );
};

export default MicrophoneButton;
