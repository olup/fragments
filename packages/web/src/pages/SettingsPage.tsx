import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Center, Flex, Heading, Text } from "@chakra-ui/layout";
import { Container } from "components/Layout";
import { useAppStore } from "hooks/appStore";
import { useAuth } from "hooks/useAuth";
import { useGithubContext } from "hooks/useGithub";
import React, { useEffect, useState } from "react";
import { HiPlus, HiPlusCircle } from "react-icons/hi";

export const SettingsPage = () => {
  const { token } = useAuth();
  const [repos, setRepos] = useState<{ name: string; owner: any }[]>([]);
  const [newRepoName, setNewRepoName] = useState("");
  const { set } = useAppStore();
  const { github } = useGithubContext();

  useEffect(() => {
    github?.listRepo().then((r) => setRepos(r));
  }, [github]);

  const setSettings = async (repo: { name: string; owner: any }) => {
    set({
      repo: {
        name: repo.name,
        owner: repo.owner.login,
      },
    });
  };

  const onCreateRepo = async () => {
    const repo = await github?.createRepo(newRepoName);
    if (!repo || !repo.owner) return;
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
          <Input
            placeholder="Repository name"
            mr={2}
            value={newRepoName}
            onChange={(e) => setNewRepoName(e.target.value)}
          />
          <Button
            leftIcon={<HiPlus />}
            variant="outlineRaised"
            onClick={onCreateRepo}
          >
            Create
          </Button>
        </Flex>
        <Text mb={5}> Or pick an existing private one :</Text>

        <Flex wrap="wrap">
          {repos.map((repo) => (
            <Button
              mr={3}
              mb={3}
              onClick={() => setSettings(repo)}
              variant="outlineRaised"
            >
              {repo.name}
            </Button>
          ))}
        </Flex>
      </Container>
    </Center>
  );
};
