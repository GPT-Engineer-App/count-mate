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
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        {Object.keys(counts).map((key) => (
          <React.Fragment key={key}>
            <Text fontWeight="bold">{key.toUpperCase()}:</Text>
            <Text>{counts[key]}</Text>
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
};

export default CountDisplay;
