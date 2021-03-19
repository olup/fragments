import styled from "@emotion/styled";
import { Fragment } from "components/Fragment";
import { Flex } from "components/Layout";
import { Link } from "components/Link";
import { Loading } from "components/Loading";
import { NewFragment } from "components/NewFragment";
import { useEngine } from "contexts/engine";
import {
  useDeleteFragmentMutation,
  useGetFragmentsQuery,
  useGetTagsQuery,
} from "graphql/generated";
import useStickyHeader from "hooks/useStickyHeader";
import React, { useMemo } from "react";
import { HiHashtag } from "react-icons/hi";
import { Link as RouterLink, useParams } from "react-router-dom";

const SubTagsBlock = styled.div`
  margin: 10px 0;
`;

const Header = styled.div`
  padding: 20px 0;
`;

const HiddenHeader = styled.div`
  width: 100%;
  background-color: ${(p) => p.theme.colors.pageBackgroundColor};
  top: -100px;
  position: fixed;
  z-index: 10;
  transition: 0.3s;
  &.sticky {
    top: 0;
  }
`;

export const TagPage = () => {
  const { tag: tagName } = useParams();
  const [isSticky] = useStickyHeader(250);

  const tag = useEngine((s) => s.engine.tags[tagName]);
  const getFragments = useEngine((s) => s.actions.getFragments);
  const deletFragment = useEngine((s) => s.actions.deleteFragment);
  const fragments = useMemo(() => (tag ? getFragments(tag.handles) : []), [
    tag,
  ]);

  return (
    <Flex col key={tagName} mb={20}>
      <HiddenHeader className={isSticky ? "sticky" : ""}>
        <Header>
          <RouterLink to="/">
            <Link>Back home</Link>
          </RouterLink>
          <Flex
            mt={10}
            style={{
              color: "#bbb",
              fontSize: 25,
            }}
          >
            <HiHashtag /> {tagName}
          </Flex>
        </Header>
      </HiddenHeader>

      <Header>
        <RouterLink to="/">
          <Link>Back home</Link>
        </RouterLink>
        <Flex
          mt={10}
          style={{
            color: "#bbb",
            fontSize: 40,
          }}
        >
          <HiHashtag /> {tagName}
        </Flex>
      </Header>
      {/* {!!subTags?.length && (
        <Flex mb={30}>
          {subTags.map((tag) => (
            <RouterLink to={"/tag/" + tag} key={tag}>
              <Link style={{ marginRight: 10 }}>
                <HiHashtag /> {tag}
              </Link>
            </RouterLink>
          ))}
        </Flex>
      )} */}
      {/* 
      {loading && !fragments?.length && (
        <Flex justify="center" align={"center"} h={100}>
          <Loading />
        </Flex>
      )} */}

      {fragments?.map((fragment) => (
        <Flex style={{ marginBottom: 20 }} key={fragment.handle}>
          <Fragment
            // @ts-ignore
            fragment={fragment}
            onDelete={(handle) => handle && deletFragment(handle)}
            saveOnBlur
          />
        </Flex>
      ))}

      <NewFragment
        initialContent={`\n#${tagName}`}
        placeholder="Add a note to this list"
      />
    </Flex>
  );
};
