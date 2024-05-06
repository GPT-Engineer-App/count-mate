import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

const useSpeechRecognition = () => {
  const [recognition, setRecognition] = useState(null);
  const [sessionCounts, setSessionCounts] = useState({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
  const [cumulativeCounts, setCumulativeCounts] = useState(() => {
    const savedCounts = localStorage.getItem("cumulativeTally");
    return savedCounts ? JSON.parse(savedCounts) : { PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 };
  });
  const [isRecording, setIsRecording] = useState(false);
  const toast = useToast();

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      console.log("Recording started.");
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      console.log("Recording stopped.");
    }
  };

  useEffect(() => {
    const handleAudioStart = () => {
      console.log("Audio started");
      startRecording();
    };

    const handleAudioEnd = () => {
      console.log("Audio ended");
      stopRecording();
      toast({
        title: "Microphone Disconnected",
        description: "The microphone has been disconnected or stopped unexpectedly.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    };

    recognition.addEventListener("audiostart", handleAudioStart);
    recognition.addEventListener("audioend", handleAudioEnd);

    return () => {
      recognition.removeEventListener("audiostart", handleAudioStart);
      recognition.removeEventListener("audioend", handleAudioEnd);
    };
  }, [recognition, startRecording, stopRecording, toast]);

  const resetSessionCounts = () => {
    setSessionCounts((prevCounts) => ({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 }));
  };

  const resetCumulativeCounts = () => {
    console.log("Resetting cumulative counts. Current cumulative counts:", cumulativeCounts);
    setCumulativeCounts({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
    console.log("Cumulative counts after reset:", cumulativeCounts);
  };

  return { recognition, sessionCounts, cumulativeCounts, isRecording, startRecording, stopRecording, resetSessionCounts, resetCumulativeCounts };
};

export default useSpeechRecognition;
