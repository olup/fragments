import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useKeyPress } from "hooks/useKeyPress";
import React from "react";
import { useNavigate } from "react-router-dom";
import tinyColor from "tinycolor2";

const UrlStyled = styled.span<{
  showAsLink?: boolean;
}>`
  color: ${(p) => p.theme.colors.textColor};
  border-bottom: 1px dashed
    ${(p) => tinyColor(p.theme.colors.textColor).setAlpha(0.3).toRgbString()};
  ${(p) =>
    p.showAsLink &&
    css`
      cursor: pointer;
      &:hover {
        border-bottom-color: ${p.theme.colors.textColor};
      }
    `};
`;

export const Url = ({ text: leafText, children, ...props }: any) => {
  const navigate = useNavigate();
  const ctrlPress = useKeyPress("Control");
  const metaPress = useKeyPress("Meta");

  const showAsLink = ctrlPress || metaPress;
  return (
    <UrlStyled
      showAsLink={showAsLink}
      onClick={(e) =>
        (e.ctrlKey || e.metaKey) && window.open(leafText, "_blank")
      }
      {...props}
    >
      {children}
    </UrlStyled>
  );
};
