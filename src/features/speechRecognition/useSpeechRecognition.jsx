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
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
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
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setTranscript(transcript);
    };

    recognition.onerror = (event) => {
      toast({
        title: "Recognition Error",
        description: `An error occurred during speech recognition: ${event.error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    };

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
    };
  }, [recognition, toast]);

  return { recognition, isRecording, startRecording, stopRecording, transcript, setTranscript };
};

export default useSpeechRecognition;
