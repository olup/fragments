import { buildIndex, Engine, Fragment } from "libs/engine";
import { pick } from "lodash";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { ElementaryFragment, Repo } from "../libs/github";

export const useEngine = create<{
  engine: Engine;
  repo?: Repo;
  actions: {
    reset: (engine: Engine) => void;
    getRandomFragment: () => Fragment;
    getFragments: (handles: string[]) => Fragment[];
    updateFragment: (fragment: ElementaryFragment) => Promise<Fragment>;
    deleteFragment: (handle: string) => Promise<boolean>;
    searchFragment: (searchString: string) => Fragment[];
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
      reset: (engine: Engine) => set((s) => ({ ...s, engine }), true),

      getRandomFragment: () => {
        const fragments = get().engine.fragments;
        const keys = Object.keys(fragments);
        return fragments[keys[(keys.length * Math.random()) << 0]];
      },
      getFragments: (handles: string[]) =>
        Object.values(pick(get().engine.fragments, handles)),
      updateFragment: async (fragment: ElementaryFragment) => {
        get().repo?.stageUpsert(fragment);

        const fragments: Record<string, ElementaryFragment> = get().engine
          .fragments;

        get().actions.reset(
          buildIndex(
            Object.values({ ...fragments, [fragment.handle]: fragment })
          )
        );
        return get().engine.fragments[fragment.handle];
      },
      searchFragment: (searchString: string) =>
        Object.values(get().engine.fragments).filter((f) =>
          JSON.stringify(f).includes(searchString)
        ),

      deleteFragment: async (handle: string) => {
        const fragment = get().engine.fragments[handle];
        get().repo?.stageDelete(handle);

        if (fragment) {
          get().actions.reset(
            buildIndex(
              Object.values(get().engine.fragments).filter(
                (f) => f.handle !== handle
              )
            )
          );
        }

        return true;
      },
      getTag: (name) => get().engine.tags[name],
      setRepo: (repo) => set({ repo }),
    },
  }))
);
