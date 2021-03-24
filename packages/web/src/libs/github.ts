import { Octokit } from "@octokit/rest";
import { format } from "date-fns";
import { gql, GraphQLClient } from "graphql-request";
import { keyBy, omit } from "lodash";

export type ElementaryFragment = {
  handle: string;
  content: string;
};

const query = gql`
  query($repo: String!, $owner: String!) {
    repository(name: $repo, owner: $owner) {
      object(expression: "main:fragments") {
        ... on Tree {
          entries {
            name
            object {
              ... on Blob {
                text
              }
            }
          }
        }
      }
    }
  }
`;

export const createGithubKit = async (token: string) => {
  const ok = new Octokit({
    auth: token,
  });

  const gqlClient = new GraphQLClient("https://api.github.com/graphql", {
    headers: {
      authorization: "bearer " + token,
    },
  });

  const listRepo = async () =>
    fetch("https://api.github.com/user/repos?type=private", {
      headers: { authorization: "token " + token },
    }).then((r) => r.json());

  const initRepo = (repo: string, owner: string) => {
    let isCommiting = false;
    let hasStagedElements = false;

    const queue: {
      toDelete?: string[];
      toUpsert?: ElementaryFragment[];
    } = {
      toDelete: [],
      toUpsert: [],
    };

    const getAllFragments = async (): Promise<ElementaryFragment[]> => {
      const result = await gqlClient.request(query, {
        owner: owner,
        repo: repo,
      });

      const fragments =
        result?.repository?.object?.entries?.map((e: any) => ({
          handle: e.name.replace(".md", ""),
          content: e.object.text,
        })) || [];

      return fragments;
    };

    const stageDelete = (handle: string) => {
      hasStagedElements = true;
      queue.toDelete?.push(handle);
    };
    const stageUpsert = (fragment: ElementaryFragment) => {
      hasStagedElements = true;
      queue.toUpsert?.push(fragment);
    };

    const commit = async (
      {
        toDelete = [],
        toUpsert = [],
      }: {
        toDelete?: string[];
        toUpsert?: ElementaryFragment[];
      },
      message = ""
    ) => {
      if (!toDelete.length && !toUpsert.length) return;
      if (!ok) return;
      const commonParams = { owner: owner, repo: repo };

      const toDeletePath = toDelete.map((handle) => `fragments/${handle}.md`);
      const toUpsertByPath = keyBy(
        toUpsert.map((f) => ({
          path: `fragments/${f.handle}.md`,
          content: f.content,
          mode: "100644",
          type: "blob",
        })),
        "path"
      );

      const head = await ok.git.getRef({
        ...commonParams,
        ref: "heads/main",
      });
      const lastCommit = await ok.git.getCommit({
        ...commonParams,
        commit_sha: head.data.object.sha,
      });
      const lastTree = await ok.git.getTree({
        ...commonParams,
        tree_sha: lastCommit.data.tree.sha,
        recursive: "true",
      });

      const lastTreeEntryFileList = lastTree.data.tree.filter(
        (e) => e.type === "blob"
      );

      const lastTreeEntryFileListByPath = keyBy(lastTreeEntryFileList, "path");
      const filesWithoutDeletesByPath = omit(
        lastTreeEntryFileListByPath,
        toDeletePath
      );
      const withWithUpsertsByPath = {
        ...filesWithoutDeletesByPath,
        ...toUpsertByPath,
      };

      const newTree = await ok.git.createTree({
        ...commonParams,
        tree: Object.values(withWithUpsertsByPath),
      });

      const newCommit = await ok.git.createCommit({
        ...commonParams,
        tree: newTree.data.sha,
        message,
        parents: [lastCommit.data.sha],
      });

      await ok.git.updateRef({
        ...commonParams,
        ref: "heads/main",
        sha: newCommit.data.sha,
      });
    };

    const commitStaged = async (message?: string) => {
      if (isCommiting) return;
      if (!hasStagedElements) return;

      console.log("Commiting staged changes");

      isCommiting = true;
      // commit the updates
      await commit(queue, message || format(new Date(), "yyyy-MM-dd hh:mm:ss"));

      console.log("Commited");

      isCommiting = false;
      // reset queue
      queue.toDelete = [];
      queue.toUpsert = [];
      hasStagedElements = false;
    };

    return {
      getAllFragments,
      isCommiting,
      stageDelete,
      stageUpsert,
      commitStaged,
      hasStagedElements,
      commit,
    };
  };

  return { initRepo, listRepo };
};

type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

export type Github = AsyncReturnType<typeof createGithubKit>;
export type Repo = AsyncReturnType<Github["initRepo"]>;
