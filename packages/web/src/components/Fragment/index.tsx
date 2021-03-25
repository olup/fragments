import { Box } from "@chakra-ui/layout";
import { Icon, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Editor } from "components/Editor";
import { Preview } from "components/Preview";
import { useEngine } from "hooks/engine";
import { Fragment as FragmentType } from "libs/engine";
import React, { FC } from "react";
import { HiDotsHorizontal, HiLink, HiOutlineLink } from "react-icons/hi";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Expander, Flex } from "../Layout";
import { Link } from "../Link";
import { useLogic } from "./hooks";
import {
  BackLinksLine,
  FragmentStyled,
  HandleInput,
  HideOut,
  Info,
} from "./styles";
import { BiDotsHorizontal } from "react-icons/bi";
import { graphqlSync } from "graphql";

export type FragmentProps = {
  fragment?: FragmentType;
  initialContent?: string;
  onDelete?: (uuid?: string) => any | void;
  onHandleChange?: (handle: string) => any | void;
  autoFocus?: boolean;
  onBlur?: () => any | void;
  saveOnBlur?: Boolean;
  autoSave?: Boolean;
};

export const Fragment: FC<FragmentProps> = (props) => {
  const navigate = useNavigate();
  const {
    onContentChange,
    onHandleChange,
    goToHandlePage,
    setUseSpellCheck,
    handle,
    onChangeHandle,
    useSpellCheck,
    hasBackLinks,
    handleBlur,
    showCount,
    setShowCount,
    c,
    w,
  } = useLogic(props);

  const { fragment, autoFocus, initialContent, onDelete } = props;
  const linkedByCount = useEngine(
    (s) => s.actions.getFragments(fragment?.linkedBy || []).length
  );

  return (
    <Box w="100%">
      <Box w="100%">
        <FragmentStyled>
          <HideOut>
            <Flex mb={5} align="center">
              <HandleInput
                value={handle}
                onChange={(e) => onHandleChange(e.target.value)}
                spellCheck={false}
                onBlur={() => onChangeHandle()}
                onClick={goToHandlePage}
              />
              {linkedByCount > 0 && (
                <Flex align="center" ml={5} color="#ccc">
                  <Icon as={HiLink} mr={1} /> {linkedByCount}
                </Flex>
              )}
              <Expander />
              <Menu>
                <MenuButton
                  h={5}
                  color="#ccc"
                  p={2}
                  _hover={{ color: "#aaa", backgroundColor: "#f9f9f9" }}
                >
                  <Icon as={BiDotsHorizontal} fontSize="20px" />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => navigate("/handle/" + handle)}>
                    Open
                  </MenuItem>
                  <MenuItem onClick={() => setUseSpellCheck(!useSpellCheck)}>
                    {useSpellCheck ? "Disable" : "Enable"} spellCheck
                  </MenuItem>
                  <MenuItem onClick={() => setShowCount(!showCount)}>
                    {showCount ? "Hide" : "Show"} count
                  </MenuItem>
                  <MenuItem onClick={() => onDelete?.(handle)}>Delete</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </HideOut>
          <Editor
            key={fragment?.content}
            autoFocus={autoFocus}
            onChange={onContentChange}
            initialValue={fragment?.content || initialContent || ""}
            handle={handle}
            onBlur={handleBlur}
            spellCheck={useSpellCheck}
          />
          <HideOut>
            <Flex mt={5}>
              {/* <Info>
                  {format(fragment?.createdAt || new Date(), "dd/MM/yyyy")}
                </Info> */}
              {/* <Info mr={2}>
                  <Link
                    onClick={() => setUseSpellCheck(!useSpellCheck)}
                    active={useSpellCheck}
                  >
                    <HiOutlineBadgeCheck />
                  </Link>
                </Info>
                <Info mr={2}>
                  <Link
                    onClick={() => setShowCount(!showCount)}
                    active={showCount}
                  >
                    <HiOutlineChartSquareBar />
                  </Link>
                </Info> */}
              <Expander />
              {showCount && (
                <Box opacity={0.3}>
                  c {c} w {w}
                </Box>
              )}
            </Flex>
          </HideOut>
        </FragmentStyled>
        {/* {hasBackLinks && (
          <BackLinksLine mt={5}>
            <HiOutlineLink size={18} />
            {linkedBy?.map((link) => (
              <Flex mr={2} key={link.handle}>
                <Preview
                  handle={link.handle}
                  previewContent={link.content.slice(20)}
                >
                  <RouterLink to={"/handle/" + link?.handle}>
                    <Link>{link?.handle}</Link>
                  </RouterLink>
                </Preview>
              </Flex>
            ))}
          </BackLinksLine>
        )} */}
      </Box>
    </Box>
  );
};
