import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

const useSpeechRecognition = () => {
  const [recognition, setRecognition] = useState(() => {
    const recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognitionInstance.lang = "en-US";
    const speechRecognitionList = new window.SpeechGrammarList();
    const grammar = "#JSGF V1.0; grammar items; public <item> = pet | hdp | can | glass | carton ;";
    speechRecognitionList.addFromString(grammar, 1);
    recognitionInstance.grammars = speechRecognitionList;
    return recognitionInstance;
  });
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
    recognition.onresult = function (event) {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      console.log("Transcript:", transcript);
    };
    recognition.onerror = function (event) {
      console.error("Recognition error:", event.error);
    };

    return () => {
      if (recognition) {
        recognition.removeEventListener("audiostart", handleAudioStart);
        recognition.removeEventListener("audioend", handleAudioEnd);
        recognition.stop();
        console.log("Cleanup: Removed event listeners and stopped recognition to prevent state updates after unmount.");
      }
    };
  }, [recognition, startRecording, stopRecording, toast]);

  const resetSessionCounts = () => {
    console.log("Resetting session counts.");
    setSessionCounts({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
  };

  const resetCumulativeCounts = () => {
    console.log("Resetting cumulative counts.");
    setCumulativeCounts({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
  };

  return { recognition, sessionCounts, cumulativeCounts, isRecording, startRecording, stopRecording, resetSessionCounts, resetCumulativeCounts };
};

export default useSpeechRecognition;
