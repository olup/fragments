import { Fragment } from "components/Fragment";
import { Flex } from "components/Layout";
import { Link } from "components/Link";
import { Loading } from "components/Loading";
import { NewFragment } from "components/NewFragment";
import {
  useDeleteFragmentMutation,
  useGetFragmentByHandleQuery,
  useGetFragmentsQuery,
} from "graphql/generated";
import React, { useCallback } from "react";

export const Home = () => {
  const { data, loading, refetch } = useGetFragmentsQuery({
    variables: { filter: { tags: "home" } },
    fetchPolicy: "cache-and-network",
  });

  const fragments = data?.fragments;

  const [deleteFragment] = useDeleteFragmentMutation();
  const onDelete = (uuid: string) => {
    deleteFragment({ variables: { uuid } });
    refetch();
  };

  return (
    <div>
      {loading && !fragments?.length && (
        <Flex justify="center" mt={50}>
          <Loading />
        </Flex>
      )}

      {!loading && !fragments?.length && (
        <Flex
          style={{
            justifyContent: "center",
            margin: "50px 0",
            color: "#bbb",
          }}
        >
          To add a fragment to your home, just tag it "#home"
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
      <Flex style={{ marginBottom: 20 }}>
        <NewFragment onOutsideClick={refetch} placeholder="New fragment" />
      </Flex>
    </div>
  );
};
