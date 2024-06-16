import React from "react";
import { Box, Text, Grid } from "@chakra-ui/react";

const CountDisplay = ({ counts = {}, title }) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px">
      {title && (
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          {title}
        </Text>
      )}
      <Grid templateColumns={`repeat(${Object.keys(counts).length}, 1fr)`} textAlign="center" gap={4}>
        {Object.keys(counts).map((key) => (
          <Box key={key}>
            <Text fontSize="lg" fontWeight="bold">
              {key.toUpperCase()}
            </Text>
            <Text fontSize="md">{counts[key]}</Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default CountDisplay;
