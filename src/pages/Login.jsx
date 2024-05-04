import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Input, Button, FormControl, FormLabel, Text, VStack } from "@chakra-ui/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("https://pqpuuzpdmzabgmwyitrt.supabase.co/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcHV1enBkbXphYmdtd3lpdHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ2NTQzNDUsImV4cCI6MjAzMDIzMDM0NX0.Zbu9RinGiMzpM-GQf5RNv41r0R4OUOmM4mIAvSninJU",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcHV1enBkbXphYmdtd3lpdHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ2NTQzNDUsImV4cCI6MjAzMDIzMDM0NX0.Zbu9RinGiMzpM-GQf5RNv41r0R4OUOmM4mIAvSninJU",
      },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("auth", JSON.stringify(data));
      localStorage.setItem("loginTime", new Date().toISOString());
      navigate("/");
    } else {
      alert("Login failed!");
    }

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("auth", JSON.stringify(data));
      navigate("/");
    } else {
      alert("Login failed!");
    }
  };

  return (
    <VStack spacing={8} p={10} boxShadow="md" borderRadius="lg" bg="whiteAlpha.900">
      <Text fontSize="3xl" fontFamily="Times New Roman" fontWeight="bold" color="green.600">
        Welcome
      </Text>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
      </FormControl>
      <Button type="submit" colorScheme="green" size="lg" fontSize="md">
        Login
      </Button>
      <Button colorScheme="blue" size="lg" fontSize="md" onClick={() => alert("Facebook login simulated")}>
        Login with Facebook
      </Button>
    </VStack>
  );
}

export default Login;
