import { Box, Text, VStack } from "@chakra-ui/react";

const About = () => {
  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <Text fontSize="2xl" fontWeight="bold">
        About This App
      </Text>
      <Box>
        <Text>This application helps users count and track various types of recyclables. It utilizes modern web technologies for a seamless user experience.</Text>
      </Box>
    </VStack>
  );
};

export default About;
