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
  const [sessionCounts, setSessionCounts] = useState({ PET: 0, HDP: 0, CAN: 0, GLASS: 0, CARTON: 0 });
  const [cumulativeCounts, setCumulativeCounts] = useState(() => {
    const savedCounts = localStorage.getItem("cumulativeTally");
    return savedCounts ? JSON.parse(savedCounts) : { PET: 0, HDP: 0, CAN: 0, GLASS: 0, CARTON: 0 };
  });
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [counter, setCounter] = useState(0);

  const detectKeywordsCustom = (transcript) => {
    const keywords = ["pet", "high-density polyethylene", "can", "glass", "carton"];
    const counts = {};
    const words = transcript.toLowerCase().split(/\s+/);
    keywords.forEach((keyword) => {
      counts[keyword.toUpperCase()] = words.filter((word) => word === keyword).length;
    });
    return counts;
  };
  const toast = useToast();

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
      console.log("Recording started.");
    }
  };

  const pauseRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
      console.log("Recording paused.");
    }
  };

  const abortRecording = () => {
    if (recognition) {
      recognition.abort();
      setIsRecording(false);
      console.log("Recording aborted.");
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
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

    recognition.onaudiostart = handleAudioStart;
    recognition.onaudioend = handleAudioEnd;
    recognition.onresult = function (event) {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setTranscript(transcript);
      console.log("Transcript received:", transcript);
      const controlKeywords = ["start", "stop"];
      const triggerKeywords = ["count", "add"];
      const words = transcript.toLowerCase().split(/\s+/);
      const detectedControls = words.filter((word) => controlKeywords.includes(word));
      if (detectedControls.includes("start")) {
        startRecording();
      } else if (detectedControls.includes("stop")) {
        stopRecording();
      }
      const detectedTriggers = words.filter((word) => triggerKeywords.includes(word)).length;
      if (detectedTriggers > 0) {
        const updatedSessionCounts = { ...sessionCounts };
        Object.keys(updatedSessionCounts).forEach((key) => {
          updatedSessionCounts[key] += detectedTriggers;
        });
        setSessionCounts(updatedSessionCounts);
        const updatedCumulativeCounts = { ...cumulativeCounts };
        Object.keys(updatedCumulativeCounts).forEach((key) => {
          updatedCumulativeCounts[key] += detectedTriggers;
        });
        setCumulativeCounts(updatedCumulativeCounts);
      }
    };
    recognition.onerror = function (event) {
      console.error("Recognition error:", event.error);
    };

    return () => {
      recognition.onaudiostart = null;
      recognition.onaudioend = null;
      recognition.stop();
      console.log("Cleanup: Removed event listeners and stopped recognition to prevent state updates after unmount.");
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
