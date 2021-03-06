import { Fragment } from "components/Fragment";
import { Flex } from "components/Layout";
import { Link } from "components/Link";
import { NewFragment } from "components/NewFragment";
import {
  useDeleteFragmentMutation,
  useGetFragmentsQuery,
} from "graphql/generated";
import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";

export const Feed = () => {
  const { data: fragmentQuery, refetch } = useGetFragmentsQuery({
    fetchPolicy: "cache-and-network",
  });
  const fragments = useMemo(() => fragmentQuery?.fragments, [fragmentQuery]);

  const { data: starFragmentQuery } = useGetFragmentsQuery({
    variables: { filter: { tags: "star" } },
  });

  const starFragments = useMemo(() => starFragmentQuery?.fragments, [
    starFragmentQuery,
  ]);

  const [deleteFragment] = useDeleteFragmentMutation();

  const onDelete = (uuid: string) => {
    deleteFragment({ variables: { uuid } });
    refetch();
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      <Flex style={{ marginBottom: 20 }}>
        <RouterLink to="/">
          <Link>Back home</Link>
        </RouterLink>
      </Flex>

      <Flex>
        <NewFragment onOutsideClick={() => refetch()} />
      </Flex>

      {!!starFragments?.length && (
        <>
          <Flex
            style={{
              justifyContent: "center",
              margin: "50px 0",
              color: "#bbb",
            }}
          >
            Star Fragments
          </Flex>
          {starFragments?.map((fragment) => (
            <Flex style={{ marginBottom: 20 }} key={fragment.uuid}>
              <Fragment
                fragment={fragment}
                onDelete={(uuid) => uuid && onDelete(uuid)}
                saveOnBlur
              />
            </Flex>
          ))}
        </>
      )}
      {!!fragments?.length && (
        <>
          <Flex
            style={{
              justifyContent: "center",
              margin: "50px 0",
              color: "#bbb",
            }}
          >
            Recent Fragments
          </Flex>
          {fragments
            ?.filter((f) => !starFragments?.find((st) => st.uuid === f.uuid))
            .map((fragment) => (
              <Flex style={{ marginBottom: 20 }} key={fragment.uuid}>
                <Fragment
                  fragment={fragment}
                  onDelete={(uuid) => uuid && onDelete(uuid)}
                  saveOnBlur
                />
              </Flex>
            ))}
        </>
      )}
    </div>
  );
};
