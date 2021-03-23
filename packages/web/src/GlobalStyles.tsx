import { css, Global } from "@emotion/react";
import React from "react";

export const GlobalStyles = () => (
  <Global
    styles={css`
      @import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;300;400;500;600;700&display=swap");
    `}
  />
);
