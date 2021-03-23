import { Box } from "@chakra-ui/layout";
import { Editor } from "components/Editor";
import { useEngine } from "contexts/engine";
import { FragmentProvider } from "contexts/fragment";
import { Fragment as FragmentType } from "libs/engine";
import React, { FC } from "react";
import {
  HiDotsHorizontal,
  HiDotsVertical,
  HiMenu,
  HiOutlineBadgeCheck,
  HiOutlineChartSquareBar,
  HiOutlineLink,
  HiOutlineMenu,
  HiOutlineTrash,
} from "react-icons/hi";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Expander, Flex } from "../Layout";
import { Link } from "../Link";
import { useLogic } from "./hooks";
import { Preview } from "components/Preview";
import {
  FragmentStyled,
  HandleInput,
  HideOut,
  Info,
  BackLinksLine,
} from "./styles";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  MenuIcon,
} from "@chakra-ui/react";
import { Button } from "components/Button";

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
    onSave,
    onContentChange,
    onHandleChange,
    goToHandlePage,
    setUseSpellCheck,
    handle,
    useSpellCheck,
    hasBackLinks,
    handleBlur,
    showCount,
    setShowCount,
    c,
    w,
  } = useLogic(props);

  const { fragment, autoFocus, initialContent, onDelete } = props;
  const linkedBy = useEngine((s) =>
    s.actions.getFragments(fragment?.linkedBy || [])
  );

  return (
    <Box w="100%">
      <FragmentProvider value={fragment || undefined}>
        <Box w="100%">
          <FragmentStyled>
            <HideOut>
              <Flex>
                <HandleInput
                  value={handle}
                  onChange={(e) => onHandleChange(e.target.value)}
                  spellCheck={false}
                  onBlur={() => onSave()}
                  onClick={goToHandlePage}
                />
                <Expander />
                <Menu>
                  <MenuButton h={5} color="#ccc">
                    <HiDotsHorizontal />
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
                    <MenuItem onClick={() => onDelete?.(handle)}>
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </HideOut>
            <Editor
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
                  <Info>
                    c {c} w {w}
                  </Info>
                )}
              </Flex>
            </HideOut>
          </FragmentStyled>
          {hasBackLinks && (
            <BackLinksLine mt={5}>
              <HiOutlineLink size={18} />
              {linkedBy?.map((link) => (
                <Flex mr={2}>
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
          )}
        </Box>
      </FragmentProvider>
    </Box>
  );
};
