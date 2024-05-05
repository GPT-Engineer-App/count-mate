import { Button } from "@chakra-ui/react";

const LogoutButton = ({ onLogout }) => {
  return (
    <Button onClick={onLogout} colorScheme="red">
      Log Out
    </Button>
  );
};

export default LogoutButton;
