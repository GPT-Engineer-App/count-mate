import React, { useState } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <Flex direction="column" minH="100vh" position="relative">
      <Box p={4} bg="gray.100">
        <Flex justify="space-between" align="center">
          <Box>Session Count</Box>
          <Button onClick={toggleSettings}>Toggle Settings</Button>
        </Flex>
        <Box mt={8} h="300px" bg="blue.100">
          Statistics Box
        </Box>
      </Box>
      <AnimatePresence>
        {isSettingsOpen && (
          <MotionBox initial={{ y: "100%" }} animate={{ y: "50%" }} exit={{ y: "100%" }} position="absolute" width="100%" height="50vh" bg="white" shadow="lg" borderTop="2px solid black" transition={{ duration: 0.5 }}>
            <Box p={4}>
              <Button onClick={toggleSettings}>Close Settings</Button>
              <Box mt={4}>Settings Content Goes Here</Box>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </Flex>
  );
}

export default App;
