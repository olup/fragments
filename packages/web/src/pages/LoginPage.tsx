import { Button } from "@chakra-ui/button";
import { Box, Center, Heading, Stack, Text } from "@chakra-ui/layout";
import { useAuth } from "hooks/useAuth";
import { ImGithub } from "react-icons/im";

export const LoginPage = () => {
  const { login } = useAuth();
  return (
    <Center h="100vh" flexDir="column">
      <Heading mb={5}>Welcome to Fragment</Heading>
      <Text w="800px" mb={5}>
        Fragment is a small but powerful notebook aimed at writers. In fragment
        you can write as small an many pieces of text you want and organise them
        without thinking about it.
      </Text>
      <Text w="800px" mb={5}>
        Fragment persist data on a git repository on your github account, so you
        need one to go further.
      </Text>
      <Button leftIcon={<ImGithub />} onClick={login} variant="outlineRaised">
        Login with Github
      </Button>
    </Center>
  );
};
