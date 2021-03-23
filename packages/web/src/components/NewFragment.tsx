import styled from "@emotion/styled";
import React, { FC } from "react";
import { useState } from "react";
import { Fragment } from "./Fragment";
import OutsideClickHandler from "react-outside-click-handler";

const NewBlock = styled.div`
  padding: 20px;
  background-color: ${(p) => p.theme.colors.fragmentBackgroundColor};
  width: 100%;
  box-sizing: border-box;
  font-style: italic;
  color: #ccc;
  font-size: 20px;
  background-color: #fff;
  cursor: text;
`;

export const NewFragment: FC<{
  onOutsideClick?: () => any;
  placeholder?: string;
  initialContent?: string;
}> = ({
  onOutsideClick,
  placeholder = "What's on your mind ?",
  initialContent,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const handleBlur = () => {
    setIsEditing(false);
    onOutsideClick?.();
  };

  if (!isEditing)
    return (
      <NewBlock onClick={() => setIsEditing(true)}>{placeholder}</NewBlock>
    );
  if (isEditing)
    return (
      <Fragment
        autoFocus
        onDelete={() => setIsEditing(false)}
        initialContent={initialContent}
        saveOnBlur
        onBlur={handleBlur}
      />
    );

  return null;
};
