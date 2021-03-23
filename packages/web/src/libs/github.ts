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

export class GithubManager {
  repo = "";
  owner = "";
  accessToken = "";
  gqlClient: GraphQLClient | null = null;
  ok: Octokit | null = null;

  isCommiting = false;
  hasStagedElements = false;

  queue: {
    toDelete?: string[];
    toUpsert?: ElementaryFragment[];
  } = {
    toDelete: [],
    toUpsert: [],
  };
  async init(accessToken: string) {
    this.accessToken = accessToken;

    this.gqlClient = new GraphQLClient("https://api.github.com/graphql", {
      headers: {
        authorization: "bearer " + accessToken,
      },
    });

    this.ok = new Octokit({
      auth: this.accessToken,
    });
  }
  setRepo(ownerName: string, repoName: string) {
    this.owner = ownerName;
    this.repo = repoName;
  }

  stageDelete(handle: string) {
    this.hasStagedElements = true;
    this.queue.toDelete?.push(handle);
  }
  stageUpsert(fragment: ElementaryFragment) {
    this.hasStagedElements = true;
    this.queue.toUpsert?.push(fragment);
  }

  async commit(
    {
      toDelete = [],
      toUpsert = [],
    }: {
      toDelete?: string[];
      toUpsert?: ElementaryFragment[];
    },
    message = ""
  ) {
    if (!toDelete.length && !toUpsert.length) return;
    if (!this.ok) return;
    const commonParams = { owner: this.owner, repo: this.repo };

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

    const head = await this.ok.git.getRef({
      ...commonParams,
      ref: "heads/main",
    });
    const lastCommit = await this.ok.git.getCommit({
      ...commonParams,
      commit_sha: head.data.object.sha,
    });
    const lastTree = await this.ok.git.getTree({
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

    const newTree = await this.ok.git.createTree({
      ...commonParams,
      tree: Object.values(withWithUpsertsByPath),
    });

    const newCommit = await this.ok.git.createCommit({
      ...commonParams,
      tree: newTree.data.sha,
      message,
      parents: [lastCommit.data.sha],
    });

    await this.ok.git.updateRef({
      ...commonParams,
      ref: "heads/main",
      sha: newCommit.data.sha,
    });
  }

  async commitStaged(message?: string) {
    if (this.isCommiting) return;
    if (!this.hasStagedElements) return;

    console.log("Commiting staged changes");

    this.isCommiting = true;
    // commit the updates
    await this.commit(
      this.queue,
      message || format(new Date(), "yyyy-MM-dd hh:mm:ss")
    );

    console.log("Commited");

    this.isCommiting = false;
    // reset queue
    this.queue.toDelete = [];
    this.queue.toUpsert = [];
    this.hasStagedElements = false;
  }

  async getFragmentsContent(): Promise<ElementaryFragment[]> {
    if (!this.gqlClient) throw new Error("Gql client is not initialized");
    const result = await this.gqlClient.request(query, {
      owner: this.owner,
      repo: this.repo,
    });

    const fragments =
      result?.repository?.object?.entries?.map((e: any) => ({
        handle: e.name.replace(".md", ""),
        content: e.object.text,
      })) || [];

    return fragments;
  }

  async initRepo(name: string) {
    this.ok?.repos.createUsingTemplate({
      name,
    });
  }
}

export const github = new GithubManager();
