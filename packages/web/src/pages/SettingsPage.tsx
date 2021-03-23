import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Center, Flex, Heading, Text } from "@chakra-ui/layout";
import { Container } from "components/Layout";
import { useAppStore } from "contexts/appStore";
import { useAuth } from "hooks/useAuth";
import { github } from "libs/github";
import { setStore } from "libs/remoteStore";
import React, { useEffect, useState } from "react";
import { HiPlusCircle } from "react-icons/hi";

export const SettingsPage = () => {
  const { token } = useAuth();
  const [repos, setRepos] = useState<{ name: string; owner: any }[]>([]);
  const { set } = useAppStore();

  useEffect(() => {
    fetch("https://api.github.com/user/repos?type=private", {
      headers: { authorization: "token " + token },
    })
      .then((r) => r.json())
      .then((r) => setRepos(r));
  }, []);

  const setSettings = async (repo: { name: string; owner: any }) => {
    github.setRepo(repo.owner.login, repo.name);
    set({
      repo: {
        name: repo.name,
        owner: repo.owner.login,
      },
    });
  };

  return (
    <Center h="100vh">
      <Container>
        <Heading mb={5}>Repository</Heading>
        <Text mb={5}>
          Fragment uses github to save your fragments into a repository. This
          enables versioning, data security, and a lot of other goodness.
        </Text>
        <Text mb={5}>You can either create a new one :</Text>
        <Flex mb={5}>
          <Input placeholder="Repository name" mr={2} />
          <Button leftIcon={<HiPlusCircle />}>Create</Button>
        </Flex>
        <Text mb={5}> Or pick an existing private one :</Text>

        <Flex wrap="wrap">
          {repos.map((repo) => (
            <Button mr={3} mb={3} onClick={() => setSettings(repo)}>
              {repo.name}
            </Button>
          ))}
        </Flex>
      </Container>
    </Center>
  );
};
