import { Box } from "@chakra-ui/layout";
import { Icon, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Editor } from "components/Editor";
import { useEngine } from "hooks/engine";
import { defaultFragment, Fragment as FragmentType } from "libs/engine";
import React, { FC } from "react";
import { BiDotsHorizontal } from "react-icons/bi";
import { HiLink } from "react-icons/hi";
import { TiFlowChildren } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { generateHandle } from "utils";
import { Expander, Flex } from "../Layout";
import { useLogic } from "./hooks";
import { FragmentStyled, HandleInput, HideOut } from "./styles";

export type FragmentProps = {
  fragment?: FragmentType;
  initialContent?: string;
  onDelete?: (uuid?: string) => any | void;
  onHandleChange?: (handle: string) => any | void;
  autoFocus?: boolean;
  onBlur?: () => any | void;
  saveOnBlur?: Boolean;
  autoSave?: Boolean;
  handle?: string;
};

export const Fragment: FC<FragmentProps> = (props) => {
  const navigate = useNavigate();

  const initialFragment = useEngine(
    (s) =>
      s.engine.fragments[
        props.handle || props.fragment?.handle || generateHandle()
      ]
  );

  const fragment = initialFragment || {
    ...defaultFragment,
    handle: props.handle,
  };

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
    onDelete,
    onDetachFromParent,
    parent,
    setShowCount,
    c,
    w,
  } = useLogic({ ...props, fragment });

  const { autoFocus, initialContent } = props;
  const linkedByCount = useEngine(
    (s) => s.actions.getFragments(fragment?.linkedBy || []).length
  );
  const childrenCount = fragment.children?.length || 0;

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
              {/* How many back links ? */}
              {linkedByCount > 0 && (
                <Flex align="center" ml={5} color="#ccc">
                  <Icon as={HiLink} mr={1} /> {linkedByCount}
                </Flex>
              )}
              {/*  How many children ? */}
              {childrenCount > 0 && (
                <Flex align="center" ml={5} color="#ccc">
                  <Icon as={TiFlowChildren} mr={1} /> {childrenCount}
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
                  {parent && (
                    <MenuItem onClick={onDetachFromParent}>
                      Detach from parent
                    </MenuItem>
                  )}
                  <MenuItem onClick={onDelete}>Delete</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </HideOut>
          <Editor
            // key={fragment?.content}
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
