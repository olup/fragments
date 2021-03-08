import React, { createContext, FC, useReducer } from "react";
import { useContext } from "react";

const initialState: string[] = [];
const ForbidenHandlesContext = createContext(initialState);
export const ForbidenHandlesProvider = ForbidenHandlesContext.Provider;
export const useForbidenHandlesContext = () =>
  useContext(ForbidenHandlesContext);
