import { Box, Button, Text, VStack, useToast } from "@chakra-ui/react";

const Login = () => {
  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <Text fontSize="2xl" fontWeight="bold">
        Login Page
      </Text>
      <Box>
        <Button colorScheme="blue" onClick={() => alert("Login functionality not implemented yet")}>
          Log In
        </Button>
      </Box>
    </VStack>
  );
};

export default Login;
