import React from "react";
import { Box, Text, Grid } from "@chakra-ui/react";

const CountDisplay = ({ counts = {} }) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px">
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
