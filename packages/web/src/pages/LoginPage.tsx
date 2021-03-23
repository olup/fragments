import { Button } from "@chakra-ui/button";
import { Center } from "@chakra-ui/layout";
import { useAuth } from "hooks/useAuth";
import { ImGithub } from "react-icons/im";

export const LoginPage = () => {
  const { login } = useAuth();
  return (
    <Center h="100vh">
      <Button leftIcon={<ImGithub />} onClick={login}>
        Login with Github
      </Button>
    </Center>
  );
};
