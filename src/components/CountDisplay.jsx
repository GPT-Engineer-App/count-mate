import React from "react";
import { VStack, Text, StackDivider, Box, Heading } from "@chakra-ui/react";

const CountDisplay = ({ sessionCounts, cumulativeCounts }) => {
  return (
    <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4} align="stretch">
      <Box p={5} shadow="md" borderWidth="1px">
        <Heading fontSize="xl">Session Counts</Heading>
        {Object.keys(sessionCounts).map((key) => (
          <Text key={key}>{`${key}: ${sessionCounts[key]}`}</Text>
        ))}
      </Box>
      <Box p={5} shadow="md" borderWidth="1px">
        <Heading fontSize="xl">Cumulative Counts</Heading>
        {Object.keys(cumulativeCounts).map((key) => (
          <Text key={key}>{`${key}: ${cumulativeCounts[key]}`}</Text>
        ))}
      </Box>
    </VStack>
  );
};

export default CountDisplay;
