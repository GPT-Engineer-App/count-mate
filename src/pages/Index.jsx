import React, { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

let speechRecognition;

function Index() {
  const [transcript, setTranscript] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [recognizing, setRecognizing] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.lang = "en-US";
      speechRecognition.maxResults = 10;
      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        detectKeywords(transcript);
      };
      speechRecognition.onstart = () => {
        setRecognizing(true);
      };
      speechRecognition.onend = () => {
        setRecognizing(false);
      };
    }
  }, [toast]);

  const detectKeywords = (transcript) => {
    const keywordsToDetect = ["hello", "goodbye", "thanks"];
    let keywordFound = false;

    keywordsToDetect.forEach((keyword) => {
      if (transcript.toLowerCase().includes(keyword)) {
        setKeywords((prevKeywords) => [...prevKeywords, keyword]);
        keywordFound = true;
      }
    });

    if (keywordFound) {
      toast({
        title: "Keyword detected!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const startListening = () => {
    speechRecognition.start();
  };

  return (
    <div>
      <h1>Speech Recognition</h1>
      <p>Transcript: {transcript}</p>
      <p>Keywords: {keywords.join(", ")}</p>
      <button onClick={startListening}>Start Listening</button>
    </div>
  );
}

export default Index;
