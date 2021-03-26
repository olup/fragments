import {
  flatMap,
  groupBy,
  keyBy,
  mapValues,
  merge,
  pick,
  sortBy,
  trim,
} from "lodash";
import { ElementaryFragment } from "./github";
import matter from "gray-matter";
import { format } from "date-fns";
import { simpleHash } from "utils";
import { Handle } from "components/Editor/decorators/Handle";

export type Fragment = {
  createdAt?: string;
  updatedAt?: string;
  handle: string;
  content: string;
  tags: string[];
  linksTo: string[];
  linkedBy: string[];
  children?: string[];
  parent?: { handle: string; position: number };
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

export const build = (
  fragments: Omit<Fragment, "tags" | "linksTo" | "linkedBy">[]
): Engine => {
  console.time("building");
  let tags: string[] = [];

  const indexedFragments = fragments
    // get relations, tags and links
    .map((fragment) => {
      const matchTags = [
        ...fragment.content.matchAll(/\B#([a-zA-Z-]+\b)(?!;)/gim),
      ].map((m) => m[1]);
      tags = Array.from(new Set([...tags, ...matchTags]));

      const linksToHandle = [
        ...fragment.content.matchAll(/\B@([a-zA-Z-]+\b)(?!;)/gim),
      ].map((m) => m[1]);
      const linksToWiki = [
        ...fragment.content.matchAll(/\[\[(.*?)\]\]/gim),
      ].map((m) => m[1]);

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

  console.timeEnd("building");

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

export const fragmentToFile = (fragment: Fragment, parent?: string) => {
  const newContent = matter.stringify(fragment.content, {
    ...pick(fragment, ["createdAt", "updatedAt", "handle"]),
    ...(parent && { parent }),
  });
  return { content: trim(newContent), handle: fragment.handle };
};

export const FragmentFromFile = (
  fragment: ElementaryFragment
): Omit<Fragment, "tags" | "linksTo" | "linkedBy" | "children"> => {
  const { data, content } = matter(fragment.content);

  if (data.parent && typeof data.parent === "string") {
    const [parentHandle, positionString] = data.parent.split(":");
    data.parent = {
      handle: parentHandle,
      position: parseInt(positionString, 10),
      childHandle: fragment.handle,
    };
  }

  return {
    ...data,
    parent: data.parent,
    content: trim(content),
    handle: fragment.handle,
  };
};

export const exportToFiles = (engine: Engine) => {
  const fragments = Object.values(engine.fragments);
  const normalRelation = fragments
    .map((f) =>
      f.children?.map((childHandle, position) => ({
        handle: f.handle,
        position,
        childHandle,
      }))
    )
    .flat()
    .filter(Boolean);
  const relationByChildHandle = keyBy(normalRelation, "childHandle");
  return fragments.map((f) => {
    const parentRelation = relationByChildHandle[f.handle];
    const parentString =
      parentRelation && `${parentRelation.handle}:${parentRelation.position}`;

    return fragmentToFile(f, parentString);
  });
};

export const populateChildren = (fragments: any[]) => {
  const fragmentsByParentHandle = groupBy(
    sortBy(
      fragments
        .filter((f) => !!f.parent?.handle)
        .map((f) => ({
          handle: f.handle,
          parentHandle: f.parent?.handle,
          position: f.parent?.position,
        })),
      ["parentHandle", "position"]
    ),
    "parentHandle"
  );
  return fragments.map((f) => ({
    ...f,
    children: fragmentsByParentHandle[f.handle]?.map((el) => el.handle),
  }));
};
