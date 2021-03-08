import { createContext, useContext } from "react";
import { FragmentDisplayType } from "types";

const initialState: FragmentDisplayType | undefined = undefined;
const FragmentContext = createContext<FragmentDisplayType | undefined>(
  initialState
);
export const FragmentProvider = FragmentContext.Provider;
export const useFragmentContext = () => useContext(FragmentContext);
