import { useState, useCallback, useEffect } from "react";

const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount((prevCount) => prevCount + 1), []);
  const decrement = useCallback(() => setCount((prevCount) => prevCount - 1), []);

  useEffect(() => {
    return () => {};
  }, []);

  return { count, increment, decrement };
};

export default useCounter;
