import React from "react";
import { Button } from "@chakra-ui/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const MicrophoneButton = ({ isRecording }) => {
  return (
    <Button colorScheme={isRecording ? "red" : "green"} leftIcon={isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}>
      {isRecording ? "Microphone In Use" : "Microphone Not In Use"}
    </Button>
  );
};

export default MicrophoneButton;
