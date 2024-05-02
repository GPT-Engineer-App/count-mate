import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Input, Button, VStack, useToast, FormControl, FormLabel } from "@chakra-ui/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (event) => {
    event.preventDefault();
    const response = await fetch("https://pqpuuzpdmzabgmwyitrt.supabase.co/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcHV1enBkbXphYmdtd3lpdHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ2NTQzNDUsImV4cCI6MjAzMDIzMDM0NX0.Zbu9RinGiMzpM-GQf5RNv41r0R4OUOmM4mIAvSninJU",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("auth", JSON.stringify(data));
      navigate("/");
    } else {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh" bg="gray.200" p={5}>
      <FormControl as="form" onSubmit={handleLogin} w="100%" maxW="360px">
        <FormLabel>Email</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" mb={4} />
        <FormLabel>Password</FormLabel>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" mb={4} />
        <Button type="submit" colorScheme="blue" width="full">
          Login
        </Button>
      </FormControl>
    </VStack>
  );
}

export default Login;
