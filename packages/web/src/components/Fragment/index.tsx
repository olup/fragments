import { Fragment as FragmentType } from "graphql/generated";
import React, { FC } from "react";
import { Expander, Flex } from "../Layout";
import { Link } from "../Link";
import { Link as RouterLink } from "react-router-dom";
import { useLogic } from "./hooks";
import {
  BackLinksLine,
  FragmentStyled,
  HandleInput,
  HideOut,
  Info,
} from "./styles";
import { format } from "date-fns";
import { FragmentProvider } from "contexts/fragment";
import { Editor } from "components/Editor";
import {
  HiOutlineBadgeCheck,
  HiOutlineChartSquareBar,
  HiOutlineLink,
  HiOutlineTrash,
} from "react-icons/hi";
import { Preview } from "components/Preview";
import { FragmentDisplayType } from "types";

export const Fragment: FC<{
  fragment?: FragmentDisplayType;

  onDelete?: (uuid?: string) => any | void;
  autoFocus?: boolean;
}> = ({ fragment, onDelete, autoFocus }) => {
  const {
    handle,
    hasBackLinks,
    onSave,
    onContentChange,
    onHandleChange,
    goToHandlePage,
    useSpellCheck,
    setUseSpellCheck,
    uuid,
  } = useLogic(fragment, autoFocus);

  return (
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
            initialValue={fragment?.content || ""}
            handle={handle}
            autoSave
            spellCheck={useSpellCheck}
            onSave={onSave}
          />
          <HideOut>
            <Flex style={{ marginTop: 20 }}>
              <Info>
                {format(fragment?.createdAt || new Date(), "dd/MM/yyyy")}
              </Info>
              <Info ml={10}>
                <Link onClick={() => setUseSpellCheck(!useSpellCheck)}>
                  <HiOutlineBadgeCheck />
                </Link>
              </Info>
              <Info ml={10}>
                <Link>
                  <HiOutlineChartSquareBar />
                </Link>
              </Info>
              <Expander />
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
  );
};
