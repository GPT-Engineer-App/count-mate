import { useState } from "react";
import { loadCounts, saveCounts } from "../utils/storage";

const useCountManager = () => {
  const [counts, setCounts] = useState(() => loadCounts());

  const incrementCount = (keyword) => {
    const newCounts = { ...counts, [keyword]: (counts[keyword] || 0) + 1 };
    setCounts(newCounts);
    saveCounts(newCounts);
  };

  const resetCounts = () => {
    const resettedCounts = { PET: 0, HDP: 0, Can: 0, Glass: 0, Carton: 0 };
    setCounts(resettedCounts);
    saveCounts(resettedCounts);
  };

  return { counts, incrementCount, resetCounts };
};

export default useCountManager;
