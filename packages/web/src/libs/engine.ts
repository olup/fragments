import { useSaveFragmentMutation } from "graphql/generated";
import { argsToArgsConfig } from "graphql/type/definition";
import { flatMap, groupBy, keyBy } from "lodash";
import { ElementaryFragment } from "./github";

export type Fragment = {
  handle: string;
  content: string;
  tags: string[];
};

export type Engine = {
  fragments: {
    [handle: string]: Fragment;
  };
  tags: {
    [name: string]: {
      name: string;
      handles: string[];
    };
  };
};

export const buildIndex = (fragments: ElementaryFragment[]) => {
  let tags: string[] = [];
  const indexedFragments = fragments.map((fragment) => {
    const matchTags = [
      ...fragment.content.matchAll(/\B#([a-zA-Z-]+\b)(?!;)/gim),
    ].map((m) => m[1]);

    tags = Array.from(new Set([...tags, ...matchTags]));

    return {
      ...fragment,
      tags: Array.from(new Set(matchTags)),
    };
  });

  const fragmentByTags = groupBy(
    flatMap(
      indexedFragments.map((f) =>
        f.tags.map((tag) => ({ handle: f.handle, tag }))
      )
    ),
    "tag"
  );

  return {
    fragments: keyBy(indexedFragments, "handle"),
    tags: keyBy(
      tags.map((name) => ({
        name,
        handles: fragmentByTags[name].map((f) => f.handle),
      })),
      "name"
    ),
  };
};
