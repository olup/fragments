import { createGithubKit, Github, Repo } from "libs/github";
import { useState } from "react";
import constate from "constate";
import { useEngine } from "./engine";

export const useGithub = () => {
  const [github, setGithub] = useState<null | Github>(null);
  const [repo, setRepo] = useState<null | Repo>(null);
  const setEnginRepo = useEngine((s) => s.actions.setRepo);

  const init = async (token: string) => {
    setGithub(await createGithubKit(token));
  };

  const initRepo = async (name: string, owner: string) => {
    if (!github) return;
    const repo = await github.initRepo(name, owner);
    setRepo(repo);
    setEnginRepo(repo);
  };

  return { init, initRepo, github, repo };
};

export const [GithubProvider, useGithubContext] = constate(useGithub);
