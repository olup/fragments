import React from "react";
import { useMemo } from "react";
import {
  useDeleteFragmentMutation,
  useGetFragmentsQuery,
} from "../graphql/generated";
import { Fragment } from "./Fragment";
import { Flex } from "./Layout";

export const FragmentList = () => {
  const { data: fragmentQuery, refetch } = useGetFragmentsQuery();
  const fragments = useMemo(() => fragmentQuery?.fragments, [fragmentQuery]);

  const [deleteFragment] = useDeleteFragmentMutation();
  const onDelete = (uuid: string) => {
    deleteFragment({ variables: { uuid } });
    refetch();
  };

  return (
    <>
      {fragments?.map((fragment) => (
        <Flex style={{ marginBottom: 20 }} key={fragment.uuid}>
          <Fragment
            fragment={fragment}
            onDelete={(uuid) => uuid && onDelete(uuid)}
          />
        </Flex>
      ))}
    </>
  );
};
