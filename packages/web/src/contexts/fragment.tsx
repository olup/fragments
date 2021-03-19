import { Fragment } from "libs/engine";
import { createContext, useContext } from "react";
import { FragmentDisplayType } from "types";

const initialState: Fragment | undefined = undefined;
const FragmentContext = createContext<Fragment | undefined>(initialState);
export const FragmentProvider = FragmentContext.Provider;
export const useFragmentContext = () => useContext(FragmentContext);
