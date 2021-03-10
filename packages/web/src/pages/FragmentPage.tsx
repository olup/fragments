import { Fragment } from "components/Fragment";
import { Flex } from "components/Layout";
import { Link } from "components/Link";
import { Loading } from "components/Loading";
import {
  useDeleteFragmentMutation,
  useGetFragmentByHandleQuery,
} from "graphql/generated";
import React from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

export const FragmentPage = () => {
  const navigate = useNavigate();
  const { handle } = useParams();

  const { data, loading } = useGetFragmentByHandleQuery({
    variables: { handle },
    fetchPolicy: "cache-and-network",
  });

  const fragment = data?.fragmentByHandle;

  const [deleteFragment] = useDeleteFragmentMutation();
  const onDelete = () => {
    if (fragment?.uuid) deleteFragment({ variables: { uuid: fragment?.uuid } });
    navigate("/");
  };
  const onHandleChange = (newHandle: string) => {
    window.history.pushState(undefined, "", newHandle);
  };

  const showLoader = loading && !fragment;

  return (
    <>
      <Flex style={{ marginBottom: 20 }}>
        <RouterLink to="/">
          <Link>Back home</Link>
        </RouterLink>
      </Flex>

      {showLoader && (
        <Flex justify="center" mt={50}>
          <Loading />
        </Flex>
      )}

      {!showLoader && (
        <Fragment
          fragment={
            fragment || {
              handle,
              content: "",
              linksTo: [],
              linkedBy: [],
              tags: [],
            }
          }
          key={fragment?.handle}
          onHandleChange={onHandleChange}
          onDelete={onDelete}
        />
      )}
    </>
  );
};
