import { Box, Button, Text, VStack, Input } from "@chakra-ui/react";

const Login = () => {
  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <Text fontSize="2xl" fontWeight="bold">
        Login Page
      </Text>
      <Box>
        <Input placeholder="Username" mb={2} />
        <Input placeholder="Password" mb={2} type="password" />
        <Button colorScheme="blue">Log In</Button>
      </Box>
    </VStack>
  );
};

export default Login;
