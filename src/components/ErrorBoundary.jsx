import React, { Component } from "react";
import { Box, Text, Button } from "@chakra-ui/react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={5} shadow="md" borderWidth="1px">
          <Text fontSize="xl" fontWeight="bold" color="red.500">
            An error occurred: {this.state.error.message}
          </Text>
          <Button onClick={() => window.location.reload()} colorScheme="blue">
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
