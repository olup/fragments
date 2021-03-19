import { buildIndex, Engine, Fragment } from "libs/engine";
import { github } from "libs/github";
import { pick } from "lodash";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { ElementaryFragment } from "../libs/github";

export const useEngine = create<{
  engine: Engine;
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
  };
}>(
  devtools((set, get) => ({
    engine: {
      fragments: {},
      tags: {},
    },
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
        github.stageUpsert(fragment);

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
        github.stageDelete(handle);

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

      getTag: (name: string) => get().engine.tags[name],
    },
  }))
);
