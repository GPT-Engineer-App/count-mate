import { useState } from "react";

const useSpeechRecognition = () => {
  const [recognition, setRecognition] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  return { recognition, isRecording, startRecording, stopRecording };
};

export default useSpeechRecognition;
