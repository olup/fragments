import { Fragment, GetFragmentByHandleQuery } from "graphql/generated";
import "@emotion/react";
import { lightTheme } from "theme";

type LightTheme = typeof lightTheme;

declare module "@emotion/react" {
  export interface Theme extends LightTheme {}
}
export type FragmentDisplayType = GetFragmentByHandleQuery["fragmentByHandle"];
