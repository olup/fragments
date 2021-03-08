import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useKeyPress } from "hooks/useKeyPress";
import React from "react";
import { useNavigate } from "react-router-dom";

const TagStyled = styled.span<{
  showAsLink?: boolean;
}>`
  background-color: #ffebcc;
  padding: 0 5px;

  ${(p) =>
    p.showAsLink &&
    css`
      cursor: pointer;
      &:hover {
        border-bottom: 1px dashed;
      }
    `}
`;

export const Tag = ({ text: leafText, children, ...props }: any) => {
  const navigate = useNavigate();
  const ctrlPress = useKeyPress("Control");
  const metaPress = useKeyPress("Meta");

  const showAsLink = ctrlPress || metaPress;
  return (
    <TagStyled
      showAsLink={showAsLink}
      onClick={(e) =>
        (e.ctrlKey || e.metaKey) && navigate("/tag/" + leafText.slice(1))
      }
      {...props}
    >
      {children}
    </TagStyled>
  );
};
