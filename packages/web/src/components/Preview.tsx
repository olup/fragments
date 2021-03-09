import React from "react";
import { FC } from "react";
import { Link } from "./Link";
import { Link as RouterLink } from "react-router-dom";
import styled from "@emotion/styled/macro";

const PreviewStyled = styled.div`
  width: auto;
  z-index: 10;
  width: max-content;
  max-width: 400px;
  position: absolute;
  bottom: 100%;
  left: 0;
  padding-bottom: 10px;
  div.content {
    //border-radius: 5px;
    border: 1px solid #dfdfdf;
    background-color: white;
    box-shadow: 4px 4px 0px 0px  rgba(0, 0, 0, 0.1);
    padding: 10px;
    font-size: 14px;
  }
`;

const PreviewContainer = styled.span`
  position: relative;
  ${PreviewStyled} {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.2s, transform 0.2s;
    transform: translateY(-10px);
  }
  &:hover ${PreviewStyled} {
    visibility: visible;
    opacity: 1;
    transform: translateY(0px);
  }
`;

export const Preview: FC<{
  hide?: boolean;
  previewContent?: string;
  handle: string;
}> = ({ children, hide, previewContent, handle }) => {
  return (
    <PreviewContainer>
      <span>{children}</span>
      {!hide && (
        <PreviewStyled contentEditable={false} className="preview">
          {previewContent ? (
            <div className="content">
              <div style={{ opacity: 0.5, marginBottom: 5 }}>Preview</div>
              <div style={{ marginBottom: 5 }}>{previewContent}...</div>
              <RouterLink to={"/handle/" + handle}>
                <Link>Open</Link>
              </RouterLink>
            </div>
          ) : (
            <div className="content">
              <RouterLink to={"/handle/" + handle}>
                <Link>Create</Link>
              </RouterLink>
            </div>
          )}
        </PreviewStyled>
      )}
    </PreviewContainer>
  );
};
