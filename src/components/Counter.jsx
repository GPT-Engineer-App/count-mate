import React from "react";
import { Button, Text, VStack } from "@chakra-ui/react";
import useCounter from "../hooks/useCounter";

const Counter = () => {
  const { count, increment, decrement } = useCounter();

  return (
    <VStack>
      <Text fontSize={count > 10 ? "2xl" : "xl"} color={count > 10 ? "red.500" : "green.500"}>
        {count}
      </Text>
      <Button colorScheme="blue" onClick={increment}>
        Increment
      </Button>
      <Button colorScheme="red" onClick={decrement}>
        Decrement
      </Button>
    </VStack>
  );
};

export default Counter;
