import { Editor } from "components/Editor";
import { Preview } from "components/Preview";
import { FragmentProvider } from "contexts/fragment";
import { format } from "date-fns";
import React, { FC } from "react";
import {
  HiOutlineBadgeCheck,
  HiOutlineChartSquareBar,
  HiOutlineLink,
  HiOutlineTrash,
} from "react-icons/hi";
import { Link as RouterLink } from "react-router-dom";
import { FragmentDisplayType } from "types";
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

export type FragmentProps = {
  fragment?: FragmentDisplayType;
  initialContent?: string;
  onDelete?: (uuid?: string) => any | void;
  onHandleChange?: (handle: string) => any | void;
  autoFocus?: boolean;
  onBlur?: () => any | void;
  saveOnBlur?: Boolean;
  autoSave?: Boolean;
};

export const Fragment: FC<FragmentProps> = (props) => {
  const {
    onSave,
    onContentChange,
    onHandleChange,
    goToHandlePage,
    setUseSpellCheck,
    handle,
    useSpellCheck,
    hasBackLinks,
    uuid,
    handleBlur,
    showCount,
    setShowCount,
    c,
    w,
  } = useLogic(props);

  const { fragment, autoFocus, initialContent, onDelete } = props;

  return (
    <div style={{ width: "100%" }}>
      <FragmentProvider value={fragment || undefined}>
        <Flex col w="100%">
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
                <div>
                  <Link onClick={() => onDelete?.(uuid || undefined)}>
                    <HiOutlineTrash />
                  </Link>
                </div>
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
              <Flex mt={20}>
                <Info>
                  {format(fragment?.createdAt || new Date(), "dd/MM/yyyy")}
                </Info>
                <Info ml={10}>
                  <Link onClick={() => setUseSpellCheck(!useSpellCheck)}>
                    <HiOutlineBadgeCheck />
                  </Link>
                </Info>
                <Info ml={10}>
                  <Link onClick={() => setShowCount(!showCount)}>
                    <HiOutlineChartSquareBar />
                  </Link>
                </Info>
                <Expander />
                {showCount && (
                  <Flex>
                    c {c} | w {w}
                  </Flex>
                )}
              </Flex>
            </HideOut>
          </FragmentStyled>
          {hasBackLinks && (
            <BackLinksLine mt={20}>
              <HiOutlineLink />
              {fragment?.linkedBy?.map((link) => (
                <Flex mr={10}>
                  <Preview
                    handle={link.handle}
                    previewContent={link.previewContent}
                  >
                    <RouterLink to={"/handle/" + link?.handle}>
                      <Link>{link?.handle}</Link>
                    </RouterLink>
                  </Preview>
                </Flex>
              ))}
            </BackLinksLine>
          )}
        </Flex>
      </FragmentProvider>
    </div>
  );
};
