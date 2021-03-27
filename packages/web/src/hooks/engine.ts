import Fuse from "fuse.js";
import { build, Engine, exportToFiles, Fragment } from "libs/engine";
import { cloneDeep, pick } from "lodash";
import { VoidExpression } from "typescript";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { Repo } from "../libs/github";

export const useEngine = create<{
  engine: Engine;
  repo?: Repo;
  actions: {
    reset: (engine: Engine) => void;
    getRandomFragment: () => Fragment;
    getFragments: (handles: string[]) => Fragment[];
    updateFragment: (fragment: Fragment) => Promise<Fragment>;
    updateHandle: (oldHandle: string, newHandle: string) => Promise<Boolean>;
    deleteFragment: (handle: string) => Promise<boolean>;
    searchFragment: (searchString: string) => Fragment[];
    commit: () => void;
    getTag: (
      name: string
    ) => {
      name: string;
      handles: string[];
    };

    setRepo: (repo: any) => void;
  };
}>(
  devtools((set, get) => ({
    engine: {
      fragments: {},
      tags: {},
    },
    repo: undefined,
    actions: {
      reset: (engine: Engine) => {
        set((s) => ({ ...s, engine }), true);
      },

      getRandomFragment: () => {
        const fragments = get().engine.fragments;
        const keys = Object.keys(fragments);
        return fragments[keys[(keys.length * Math.random()) << 0]];
      },

      getFragments: (handles: string[]) =>
        Object.values(pick(get().engine.fragments, handles)),

      updateFragment: async (fragment: Fragment) => {
        const fragments: Record<string, Fragment> = get().engine.fragments;
        get().actions.reset(
          build(Object.values({ ...fragments, [fragment.handle]: fragment }))
        );
        return get().engine.fragments[fragment.handle];
      },

      updateHandle: async (oldHandle: string, newHandle: string) => {
        const updatedFragments = Object.values(get().engine.fragments).map(
          (f) => {
            const fragment = cloneDeep(f);

            if (fragment.handle === oldHandle) fragment.handle = newHandle;

            fragment.content = fragment.content.replace(
              new RegExp(`@${oldHandle}`, "gm"),
              `@${newHandle}`
            );

            fragment.content = fragment.content.replace(
              new RegExp(`\\[\\[${oldHandle}\\]\\]`, "gm"),
              `[[${newHandle}]]`
            );

            fragment.children =
              fragment.children?.map((c) => {
                if (c === oldHandle) return newHandle;
                return c;
              }) || [];
            // persist saved changes
            return fragment;
          }
        );
        get().actions.reset(build(updatedFragments));
        return true;
      },

      searchFragment: (searchString: string) => {
        if (!searchString) return [];
        const fuse = new Fuse(Object.values(get().engine.fragments), {
          keys: ["handle", "content"],
          includeMatches: true,
        });
        return fuse.search(searchString).map((el) => el.item);
      },

      deleteFragment: async (handle: string) => {
        const fragment = get().engine.fragments[handle];

        if (fragment) {
          get().actions.reset(
            build(
              Object.values(get().engine.fragments)
                .map((f) => {
                  if (f.children?.includes(handle))
                    f.children = f.children.filter((h) => h !== handle);
                  return f;
                })
                .filter((f) => f.handle !== handle)
            )
          );
        }

        return true;
      },
      getTag: (name) => get().engine.tags[name],
      setRepo: (repo) => set({ repo }),
      commit: () => {
        get().repo?.stageChanges(exportToFiles(get().engine));
        get().repo?.commitStaged();
      },
    },
  }))
);
