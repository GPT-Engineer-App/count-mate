import React from "react";
import { Button } from "@chakra-ui/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const MicrophoneButton = ({ isRecording, startRecording, pauseRecording, abortRecording }) => {
  return (
    <Button onClick={isRecording ? pauseRecording : startRecording} colorScheme={isRecording ? "red" : "green"} leftIcon={isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}>
      {isRecording ? "Pause Recording" : "Start Recording"}
    </Button>
  );
};

export default MicrophoneButton;
