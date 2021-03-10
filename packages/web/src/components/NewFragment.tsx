import styled from "@emotion/styled";
import React, { FC } from "react";
import { useState } from "react";
import { Fragment } from "./Fragment";
import OutsideClickHandler from "react-outside-click-handler";

const NewBlock = styled.div`
  padding: 20px;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
  font-style: italic;
  color: #ccc;
  font-size: 20px;
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
  const handleOutsideClick = () => {
    setIsEditing(false);
    onOutsideClick?.();
  };

  if (!isEditing)
    return (
      <NewBlock onClick={() => setIsEditing(true)}>{placeholder}</NewBlock>
    );
  if (isEditing)
    return (
      <div style={{ width: "100%" }}>
        <OutsideClickHandler onOutsideClick={handleOutsideClick}>
          <Fragment
            autoFocus
            onDelete={() => setIsEditing(false)}
            initialContent={initialContent}
          />
        </OutsideClickHandler>
      </div>
    );

  return null;
};
