import { buildIndex } from "libs/engine";
import { useEffect } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useAppStore } from "./appStore";
import { useEngine } from "./engine";
import { useAuth } from "./useAuth";
import { useGithubContext } from "./useGithub";

export const useAppInit = () => {
  const { init, token } = useAuth();
  const reset = useEngine((s) => s.actions.reset);
  const { repo } = useAppStore();
  const {
    repo: githubRepo,
    init: initGithub,
    initRepo,
    github,
  } = useGithubContext();

  useIdleTimer({
    timeout: 5 * 1000,
    onIdle: () => {
      if (githubRepo) githubRepo.commitStaged();
    },
  });

  useEffect(() => {
    if (token) {
      initGithub(token);
    }
  }, [token]);

  useEffect(() => {
    if (repo && github) {
      initRepo(repo.name, repo.owner);
    }
  }, [github, repo]);

  useEffect(() => {
    if (githubRepo) {
      githubRepo
        .getAllFragments()
        .then((fragments: any) => reset(buildIndex(fragments)));
    }
  }, [githubRepo]);

  useEffect(() => {
    init();
  }, []);
};
