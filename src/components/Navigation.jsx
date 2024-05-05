import { Box, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const Navigation = () => {
  return (
    <Box p={4} bg="gray.100" display="flex" justifyContent="space-between">
      <Link as={RouterLink} to="/" p={2}>
        Home
      </Link>
      <Link as={RouterLink} to="/about" p={2}>
        About
      </Link>
      <Link as={RouterLink} to="/login" p={2}>
        Login
      </Link>
    </Box>
  );
};

export default Navigation;
