import { useState } from "react";

const useCountManager = () => {
  const [sessionCounts, setSessionCounts] = useState({ pet: 0, hdp: 0, can: 0, glass: 0, carton: 0 });
  const [cumulativeCounts, setCumulativeCounts] = useState({ pet: 0, hdp: 0, can: 0, glass: 0, carton: 0 });

  const resetSessionCounts = () => {
    setSessionCounts({ pet: 0, hdp: 0, can: 0, glass: 0, carton: 0 });
  };

  const addSessionCountsToCumulative = () => {
    let updatedCumulative = { ...cumulativeCounts };
    Object.keys(sessionCounts).forEach((key) => {
      updatedCumulative[key] += sessionCounts[key];
    });
    setCumulativeCounts(updatedCumulative);
    resetSessionCounts();
  };

  return { sessionCounts, setSessionCounts, cumulativeCounts, addSessionCountsToCumulative };
};

export default useCountManager;
