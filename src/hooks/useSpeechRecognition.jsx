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
    console.log("Starting recording. Current state:", { sessionCounts, cumulativeCounts, isRecording });
  };

  const stopRecording = () => {
    console.log("Stopping recording. Current state before stopping:", { sessionCounts, cumulativeCounts, isRecording });
  };

  const resetSessionCounts = () => {
    console.log("Resetting session counts. Current session counts:", sessionCounts);
    setSessionCounts({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
    console.log("Session counts after reset:", sessionCounts);
  };

  const resetCumulativeCounts = () => {
    console.log("Resetting cumulative counts. Current cumulative counts:", cumulativeCounts);
    setCumulativeCounts({ PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 });
    console.log("Cumulative counts after reset:", cumulativeCounts);
  };

  return { recognition, sessionCounts, cumulativeCounts, isRecording, startRecording, stopRecording, resetSessionCounts, resetCumulativeCounts };
};

export default useSpeechRecognition;
