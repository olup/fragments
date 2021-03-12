import create from "zustand";

export const useAppStore = create<{
  useDarkMode: boolean;
  useTypewriterMode: boolean;
  set: any;
}>((set) => ({
  useDarkMode: false,
  useTypewriterMode: false,
  set: (obj: any) => set((s) => ({ ...s, ...obj })),
}));
