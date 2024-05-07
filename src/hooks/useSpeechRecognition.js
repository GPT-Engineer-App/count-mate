import { useState } from "react";

const useSpeechRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => setIsRecording(true);
  const stopRecording = () => setIsRecording(false);

  return { isRecording, startRecording, stopRecording };
};

export default useSpeechRecognition;
