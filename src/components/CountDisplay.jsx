import React from "react";
import { Box, Text, Grid } from "@chakra-ui/react";

const CountDisplay = ({ counts = { session: {}, cumulative: {} } }) => {
  return (
    <>
      <Box p={5} shadow="md" borderWidth="1px">
        <Text fontSize="xl" fontWeight="bold">
          Session Counts
        </Text>
        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
          {Object.keys(counts.session).map((key) => (
            <React.Fragment key={key}>
              <Text fontWeight="bold">{key.toUpperCase()}:</Text>
              <Text>{counts.session[key]}</Text>
            </React.Fragment>
          ))}
        </Grid>
      </Box>
      <Box mt={4} p={5} shadow="md" borderWidth="1px">
        <Text fontSize="xl" fontWeight="bold">
          Cumulative Counts
        </Text>
        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
          {Object.keys(counts.cumulative).map((key) => (
            <React.Fragment key={key}>
              <Text fontWeight="bold">{key.toUpperCase()}:</Text>
              <Text color="blue.500">{counts.cumulative[key]}</Text>
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default CountDisplay;
