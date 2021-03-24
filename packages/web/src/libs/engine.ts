import { flatMap, groupBy, keyBy, mapValues, merge, pick, trim } from "lodash";
import { ElementaryFragment } from "./github";
import matter from "gray-matter";
import { format } from "date-fns";

export type Fragment = {
  createdAt?: string;
  updatedAt?: string;
  handle: string;
  content: string;
  tags: string[];
  linksTo: string[];
  linkedBy: string[];
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

export const defaultFragment = {
  createdAt: format(new Date(), "yyyy-MM-dd"),
  updatedAt: format(new Date(), "yyyy-MM-dd"),
  tags: [],
  linksTo: [],
  linkedBy: [],
};

export const build = (fragments: ElementaryFragment[]): Engine => {
  let tags: string[] = [];

  const indexedFragments = fragments.map((fragment) => {
    const matchTags = [
      ...fragment.content.matchAll(/\B#([a-zA-Z-]+\b)(?!;)/gim),
    ].map((m) => m[1]);
    tags = Array.from(new Set([...tags, ...matchTags]));

    const linksToHandle = [
      ...fragment.content.matchAll(/\B@([a-zA-Z-]+\b)(?!;)/gim),
    ].map((m) => m[1]);
    const linksToWiki = [...fragment.content.matchAll(/\[\[(.*?)\]\]/gim)].map(
      (m) => m[1]
    );

    return {
      ...fragment,
      tags: Array.from(new Set(matchTags)),
      linksTo: Array.from(new Set([...linksToHandle, ...linksToWiki])),
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

  const fragmentsByHandle = keyBy(indexedFragments, "handle");
  const fragmentByLinks = groupBy(
    flatMap(
      indexedFragments.map((f) =>
        f.linksTo.map((link) => ({ handle: f.handle, link }))
      )
    ).filter((l) => fragmentsByHandle[l.link]),
    "link"
  );

  merge(
    fragmentsByHandle,
    mapValues(fragmentByLinks, (f) => ({ linkedBy: f.map((v) => v.handle) }))
  );

  return {
    fragments: fragmentsByHandle as Record<string, Fragment>,
    tags: keyBy(
      tags.map((name) => ({
        name,
        handles: fragmentByTags[name].map((f) => f.handle),
      })),
      "name"
    ),
  };
};

export const fragmentToFile = (fragment: Fragment) => {
  const newContent = matter.stringify(
    fragment.content,
    pick(fragment, ["createdAt", "updatedAt", "handle"])
  );
  return { content: trim(newContent), handle: fragment.handle };
};

export const FragmentFromFile = (fragment: ElementaryFragment) => {
  const { data, content } = matter(fragment.content);
  return {
    ...data,
    content: trim(content),
    handle: fragment.handle,
    originalContent: fragment.content,
  };
};
