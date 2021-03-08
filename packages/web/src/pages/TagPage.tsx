import styled from "@emotion/styled";
import { Fragment } from "components/Fragment";
import { Flex } from "components/Layout";
import { Link } from "components/Link";
import { Loading } from "components/Loading";
import {
  useDeleteFragmentMutation,
  useGetFragmentsQuery,
  useGetTagsQuery,
} from "graphql/generated";
import React, { useMemo } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

const SubTagsBlock = styled.div`
  margin: 10px 0;
`;

export const TagPage = () => {
  const { tag } = useParams();

  const { data: fragmentQuery, refetch, loading } = useGetFragmentsQuery({
    variables: { filter: { tags: tag } },
  });
  const fragments = useMemo(() => fragmentQuery?.fragments, [fragmentQuery]);
  const { data: tagsQuery } = useGetTagsQuery({
    fetchPolicy: "cache-and-network",
  });
  const subTags = tagsQuery?.tags.filter((t) => t.startsWith(tag + "-"));

  const [deleteFragment] = useDeleteFragmentMutation();
  const onDelete = (uuid: string) => {
    deleteFragment({ variables: { uuid } });
    refetch();
  };

  return (
    <Flex col key={tag}>
      <RouterLink to="/">
        <Link>Back home</Link>
      </RouterLink>
      <Flex
        mt={10}
        mb={20}
        style={{
          color: "#bbb",
          fontSize: 40,
        }}
      >
        #{tag}
      </Flex>
      {!!subTags?.length && (
        <Flex mb={30}>
          {subTags.map((tag) => (
            <RouterLink to={"/tag/" + tag}>
              <Link style={{ marginRight: 10 }}>#{tag}</Link>
            </RouterLink>
          ))}
        </Flex>
      )}

      {loading && !fragments?.length && (
        <Flex justify="center" mt={50}>
          <Loading />
        </Flex>
      )}

      {fragments?.map((fragment) => (
        <Flex style={{ marginBottom: 20 }} key={fragment.uuid}>
          <Fragment
            fragment={fragment}
            onDelete={(uuid) => uuid && onDelete(uuid)}
          />
        </Flex>
      ))}
    </Flex>
  );
};
