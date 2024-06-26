import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

const useSpeechRecognition = () => {
  const [recognition] = useState(() => {
    const recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognitionInstance.lang = "en-US";
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.maxAlternatives = 1;
    recognitionInstance.grammars = new window.SpeechGrammarList();
    recognitionInstance.grammars.addFromString("#JSGF V1.0; grammar items; public <item> = pet | hdp | can | glass | carton ;", 1);
    return recognitionInstance;
  });
  const [sessionCounts, setSessionCounts] = useState({ PET: 0, HDP: 0, CAN: 0, GLASS: 0, CARTON: 0 });
  const [cumulativeCounts, setCumulativeCounts] = useState(() => {
    const savedCounts = localStorage.getItem("cumulativeTally");
    return savedCounts ? JSON.parse(savedCounts) : { PET: 0, HDP: 0, CAN: 0, GLASS: 0, CARTON: 0 };
  });
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [keywordCounts, setKeywordCounts] = useState({ PET: 0, HDP: 0, CAN: 0, GLASS: 0, CARTON: 0 });

  const countKeywords = (transcript) => {
    const keywords = ["pet", "hdp", "can", "glass", "carton"];
    const words = transcript.toLowerCase().split(/\s+/);
    const counts = {};
    keywords.forEach((keyword) => {
      counts[keyword.toUpperCase()] = (counts[keyword.toUpperCase()] || 0) + words.filter((word) => word === keyword).length;
    });
    return counts;
  };

  useEffect(() => {
    const newCounts = countKeywords(transcript);
    setKeywordCounts((prevCounts) => {
      const updatedCounts = { ...prevCounts };
      Object.keys(newCounts).forEach((key) => {
        updatedCounts[key] += newCounts[key];
      });
      return updatedCounts;
    });
  }, [transcript]);
  const [counter, setCounter] = useState(0);

  const detectKeywordsCustom = (transcript) => {
    const keywords = ["pet", "hdp", "can", "glass", "carton"];
    const words = transcript.toLowerCase().split(/\s+/);
    let currentCount = 1;
    const updatedCounts = { ...sessionCounts };

    for (const word of words) {
      if (keywords.includes(word)) {
        updatedCounts[word] = (updatedCounts[word] || 0) + currentCount;
        toast({
          title: "Keyword Detected",
          description: `Counted ${currentCount} ${word.toUpperCase()}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        currentCount = 1;
      } else if (!isNaN(parseInt(word))) {
        currentCount = parseInt(word);
      }
    }

    setSessionCounts(updatedCounts);
    return updatedCounts;
  };
  const toast = useToast();

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
      console.log("Recording started.");
      new Audio("/start-beep.mp3").play();
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
      new Audio("/stop-beep.mp3").play();
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
      const detectedKeywords = detectKeywordsCustom(transcript);
      Object.keys(detectedKeywords).forEach((key) => {
        if (detectedKeywords[key] > 0) {
          const newCount = sessionCounts[key] + detectedKeywords[key];
          setSessionCounts((prevCounts) => ({ ...prevCounts, [key]: newCount }));
          toast({
            title: "Keyword Detected",
            description: `${key} detected ${detectedKeywords[key]} times`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          toast({
            title: "Keyword Detected",
            description: `${key} detected ${detectedKeywords[key]} times`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      });
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
