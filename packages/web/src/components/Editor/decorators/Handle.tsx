import React from "react";
import { css, jsx } from "@emotion/react";
import { useFragmentContext } from "contexts/fragment";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled/macro";
import { Link } from "components/Link";
import { Link as RouterLink } from "react-router-dom";
import { useKeyPress } from "hooks/useKeyPress";
import { Preview } from "components/Preview";

const HandleStyled = styled.span<{
  exists?: boolean;
  inline?: boolean;
  showAsLink?: boolean;
}>`
  background-color: ${(p) => (p.exists ? "#e2f8ff" : "#f1f1f1")};
  padding: 0 5px;
  color: #222;

  ${(p) =>
    p.inline &&
    css`
      opacity: 0.2;
      padding-right: 0;

      background-color: transparent;
    `}

  ${(p) =>
    p.showAsLink &&
    css`
      cursor: pointer;
      &:hover {
        border-bottom: 1px dashed;
      }
    `}
`;

export const Handle = ({ text: leafText, children, inline, ...props }: any) => {
  const navigate = useNavigate();
  const text = leafText?.slice(1) || "";
  const fragment = useFragmentContext();
  const handlePreview = fragment?.linksTo?.find((l) => l?.handle === text);

  const ctrlPress = useKeyPress("Control");
  const metaPress = useKeyPress("Meta");

  const showAsLink = ctrlPress || metaPress;

  return (
    <Preview
      handle={text}
      hide={inline}
      previewContent={handlePreview?.previewContent || undefined}
    >
      <HandleStyled
        {...props}
        inline={inline}
        exists={!!handlePreview}
        showAsLink={showAsLink}
        onClick={(e) => (e.ctrlKey || e.metaKey) && navigate("/handle/" + text)}
      >
        <span>{children}</span>
      </HandleStyled>
    </Preview>
  );
};
