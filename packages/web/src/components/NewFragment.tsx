import styled from "@emotion/styled";
import React, { FC, ReactNode } from "react";
import { useState } from "react";
import { Fragment } from "./Fragment";
import OutsideClickHandler from "react-outside-click-handler";
import { Box, BoxProps } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/color-mode";

const NewBlock: FC<BoxProps> = (props) => {
  const bg = useColorModeValue("white", "#333");
  return (
    <Box
      bg={bg}
      p={5}
      w="100%"
      fontSize={20}
      fontStyle="italic"
      cursor="text"
      color="#ccc"
      {...props}
    />
  );
};

export const NewFragment: FC<{
  onOutsideClick?: () => any;
  placeholder?: ReactNode;
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
