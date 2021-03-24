import { build, FragmentFromFile } from "libs/engine";
import { ElementaryFragment } from "libs/github";
import { useEffect } from "react";
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

  useEffect(() => {
    if (token) {
      initGithub(token);
    }
  }, [token]);

  useEffect(() => {
    if (repo && github) {
      initRepo(repo.name, repo.owner, true);
    }
  }, [github, repo]);

  useEffect(() => {
    if (githubRepo) {
      githubRepo
        .getAllFragments()
        .then((fragments: ElementaryFragment[]) =>
          reset(build(fragments.map((f) => FragmentFromFile(f))))
        );
    }
  }, [githubRepo]);

  useEffect(() => {
    init();
  }, []);
};
