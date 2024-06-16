import React from 'react';
import { Box, Switch, FormLabel, FormControl } from '@chakra-ui/react';

function Settings() {
  return (
    <Box p={4}>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="audio-streaming" mb="0">
          Enable Audio Streaming
        </FormLabel>
        <Switch id="audio-streaming" />
      </FormControl>
      {}
    </Box>
  );
}

export default Settings;