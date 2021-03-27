import { Button } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { Box, Text } from "@chakra-ui/layout";
import { Fragment } from "components/Fragment";
import { FragmentSeparator } from "components/FragmentSeparator";
import { Flex } from "components/Layout";
import { Link } from "components/Link";
import { useEngine } from "hooks/engine";
import { defaultFragment } from "libs/engine";
import React, { FC } from "react";
import { HiPlus, HiPlusCircle } from "react-icons/hi";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { Link as RouterLink, useParams } from "react-router-dom";
import { generateHandle } from "utils";

const AddIcon: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Flex
      position="absolute"
      left={-12}
      fontSize={20}
      top={-4}
      p={2}
      color="#ccc"
      height="35px"
      width="35px"
      align="center"
      justify="center"
      opacity={0}
      _hover={{ opacity: 1 }}
      cursor="pointer"
      onClick={onClick}
    >
      <Icon as={AiOutlinePlusSquare} />
    </Flex>
  );
};

export const FragmentPage = () => {
  const { handle } = useParams();

  const fragment = useEngine((s) => s.engine.fragments[handle]);
  const updateFragment = useEngine((s) => s.actions.updateFragment);
  const deleteFragment = useEngine((s) => s.actions.deleteFragment);

  const onHandleChange = (newHandle: string) => {
    window.history.pushState(undefined, "", newHandle);
  };

  const handleAddChild = (pos?: number) => {
    const children = fragment?.children?.slice() || [];
    if (pos == undefined) pos = children.length;
    const newHandle = generateHandle();
    children.splice(pos, 0, newHandle);
    updateFragment({
      ...fragment,
      children,
    });
  };

  return (
    <>
      <Flex style={{ marginBottom: 20 }}>
        <RouterLink to="/">
          <Link>Back home</Link>
        </RouterLink>
      </Flex>

      <Box mb={5}>
        <Fragment
          fragment={fragment || defaultFragment}
          key={fragment?.handle}
          onHandleChange={onHandleChange}
          onDelete={() => deleteFragment(fragment.handle)}
          saveOnBlur
        />
      </Box>

      <Box mb={5}>
        {fragment?.children?.map((childHandle, index) => {
          return (
            <Box position="relative" key={childHandle}>
              <Fragment handle={childHandle} saveOnBlur />
              {index + 1 !== fragment.children?.length && <FragmentSeparator />}
              <AddIcon onClick={() => handleAddChild(index)} />
            </Box>
          );
        })}
      </Box>
      <Flex
        align="center"
        onClick={() => handleAddChild()}
        cursor="pointer"
        fontWeight="bold"
      >
        <Icon as={HiPlus} mr={2} fontSize={20} />
        Add child fragment
      </Flex>
    </>
  );
};
