import create from "zustand";
import { persist } from "zustand/middleware";
export const useAppStore = create<{
  useDarkMode: boolean;
  useTypewriterMode: boolean;
  set: any;
}>(
  persist(
    (set) => ({
      useDarkMode: false,
      useTypewriterMode: false,
      set: (obj: any) => set((s) => ({ ...s, ...obj })),
    }),
    {
      name: "fragment-app-store",
      onRehydrateStorage: () => (s) => (s ? s.set(s) : null),
    }
  )
);
