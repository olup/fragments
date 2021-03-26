import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { Endpoints } from "@octokit/types";
import { format } from "date-fns";
import { gql, GraphQLClient } from "graphql-request";
import { debounce, keyBy, omit, uniq } from "lodash";
import { simpleHash } from "utils";

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
      authorization: "token " + token,
    },
  });

  const listRepo = async () =>
    fetch("https://api.github.com/user/repos?type=private", {
      headers: { authorization: "token " + token },
    }).then((r) => r.json());

  const createRepo = async (name = "my-fragments") =>
    (
      await ok.repos.createForAuthenticatedUser({
        name,
        auto_init: true,
        private: true,
      })
    ).data;

  const initRepo = (repo: string, owner: string, autoSave?: boolean) => {
    let isCommiting = false;
    let hasStagedElements = false;
    let lastCommit: any | undefined;
    let lastTree: any | undefined;
    let lastFilesHash: Record<string, string> = {};

    const queue: {
      toDelete: string[];
      toUpsert: ElementaryFragment[];
    } = {
      toDelete: [],
      toUpsert: [],
    };

    const getAllFragments = async (): Promise<ElementaryFragment[]> => {
      const result = await gqlClient.request(query, {
        owner: owner,
        repo: repo,
      });

      const fragments: ElementaryFragment[] =
        result?.repository?.object?.entries?.map((e: any) => ({
          handle: e.name.replace(".md", ""),
          content: e.object.text,
        })) || [];

      lastFilesHash = Object.assign(
        {},
        ...fragments.map(({ handle, content }) => ({
          [handle]: simpleHash(content),
        }))
      );

      return fragments;
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
      try {
        if (!toDelete.length && !toUpsert.length) return;
        if (!ok) return;
        const commonParams = { owner: owner, repo: repo };

        const toDeletePath = uniq(
          toDelete.map((handle) => `fragments/${handle}.md`)
        );
        const toUpsertByPath = keyBy(
          toUpsert.map((f) => ({
            path: `fragments/${f.handle}.md`,
            content: f.content,
            mode: "100644",
            type: "blob",
          })),
          "path"
        );

        //if (!lastCommit) {
        const headQuery = await ok.git.getRef({
          ...commonParams,
          ref: "heads/main",
        });
        const lastCommitQuery = await ok.git.getCommit({
          ...commonParams,
          commit_sha: headQuery.data.object.sha,
        });
        lastCommit = lastCommitQuery.data;
        //}

        //if (!lastTree) {
        const lastTreeQuery = await ok.git.getTree({
          ...commonParams,
          tree_sha: lastCommit.tree.sha,
          recursive: "true",
        });
        lastTree = lastTreeQuery.data;
        //}

        const lastTreeEntryFileList = lastTree.tree.filter(
          (e: any) => e.type === "blob"
        );

        const lastTreeEntryFileListByPath = keyBy(
          lastTreeEntryFileList,
          "path"
        );
        const filesWithoutDeletesByPath = omit(
          lastTreeEntryFileListByPath,
          toDeletePath
        );
        const withUpsertsByPath = {
          ...filesWithoutDeletesByPath,
          ...toUpsertByPath,
        };

        const newTree = await ok.git.createTree({
          ...commonParams,
          tree: Object.values(withUpsertsByPath),
        });

        const newCommit = await ok.git.createCommit({
          ...commonParams,
          tree: newTree.data.sha,
          message,
          parents: [lastCommit.sha],
        });

        await ok.git.updateRef({
          ...commonParams,
          ref: "heads/main",
          sha: newCommit.data.sha,
        });

        lastTree = newTree.data;
        lastCommit = newCommit.data;

        const newFilesHash = Object.assign(
          {},
          ...toUpsert.map(({ handle, content }) => ({
            [handle]: simpleHash(content),
          }))
        );

        lastFilesHash = { ...lastFilesHash, ...newFilesHash };
      } catch (err) {
        lastTree = undefined;
        lastCommit = undefined;

        console.log(err);
        throw err;
      }
    };

    const stageChanges = async (
      files: ElementaryFragment[],
      message?: string
    ) => {
      const changes = files.filter(
        ({ handle, content }) =>
          !lastFilesHash[handle] ||
          lastFilesHash[handle] !== simpleHash(content)
      );
      const handles = files.map((f) => f.handle);

      const deletes = Object.keys(omit(lastFilesHash, handles));

      console.log("Staging change :", changes?.length + deletes.length);

      queue.toUpsert = changes;
      queue.toDelete = deletes;

      debouncedCommitStaged(message);
    };

    const commitStaged = async (message?: string) => {
      if (isCommiting) return;
      if (!queue.toUpsert.length && !queue.toDelete.length) return;

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

    const debouncedCommitStaged = debounce(commitStaged, 1000 * 5, {
      leading: false,
      trailing: true,
    });

    return {
      getAllFragments,
      isCommiting,
      commitStaged,
      hasStagedElements,
      stageChanges,
      commit,
      lastFilesHash,
    };
  };

  return { initRepo, listRepo, createRepo };
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
