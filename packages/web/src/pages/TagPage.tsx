import styled from "@emotion/styled";
import { Fragment } from "components/Fragment";
import { Flex } from "components/Layout";
import { Link } from "components/Link";
import { Loading } from "components/Loading";
import { NewFragment } from "components/NewFragment";
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
  top: -100%;
  position: fixed;
  z-index: 10;
  &.header--detached {
    top: 0;
    transition: 0.3s;
  }
`;

export const TagPage = () => {
  const { tag } = useParams();
  const [headerRef] = useStickyHeader(100);

  const { data: fragmentQuery, refetch, loading } = useGetFragmentsQuery({
    variables: { filter: { tags: tag } },
    fetchPolicy: "cache-and-network",
  });
  const fragments = useMemo(() => fragmentQuery?.fragments.slice().reverse(), [
    fragmentQuery,
  ]);
  const { data: tagsQuery } = useGetTagsQuery({
    fetchPolicy: "cache-and-network",
  });
  const subTags = tagsQuery?.tags.filter((t) => t.startsWith(tag + "-"));

  const [deleteFragment] = useDeleteFragmentMutation();
  const onDelete = async (uuid: string) => {
    await deleteFragment({ variables: { uuid } });
    refetch();
  };

  return (
    <Flex col key={tag} mb={20}>
      <HiddenHeader ref={headerRef}>
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
            <HiHashtag /> {tag}
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
          <HiHashtag /> {tag}
        </Flex>
      </Header>
      {!!subTags?.length && (
        <Flex mb={30}>
          {subTags.map((tag) => (
            <RouterLink to={"/tag/" + tag} key={tag}>
              <Link style={{ marginRight: 10 }}>
                <HiHashtag /> {tag}
              </Link>
            </RouterLink>
          ))}
        </Flex>
      )}

      {loading && !fragments?.length && (
        <Flex justify="center" align={"center"} h={100}>
          <Loading />
        </Flex>
      )}

      {fragments?.map((fragment) => (
        <Flex style={{ marginBottom: 20 }} key={fragment.uuid}>
          <Fragment
            fragment={fragment}
            onDelete={(uuid) => uuid && onDelete(uuid)}
            saveOnBlur
          />
        </Flex>
      ))}

      <NewFragment
        initialContent={`\n#${tag}`}
        placeholder="Add a note to this list"
        onOutsideClick={refetch}
      />
    </Flex>
  );
};
