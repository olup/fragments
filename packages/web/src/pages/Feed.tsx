import { Box } from "@chakra-ui/layout";
import { Fragment } from "components/Fragment";
import { Flex } from "components/Layout";
import { Link } from "components/Link";
import { NewFragment } from "components/NewFragment";
import { useEngine } from "hooks/engine";
import { reverse, sortBy } from "lodash";
import { Link as RouterLink } from "react-router-dom";

export const Feed = () => {
  const fragmentsByHandle = useEngine((s) => s.engine.fragments);
  const fragments = sortBy(Object.values(fragmentsByHandle), "createdAt");

  const starFragments = useEngine((s) =>
    s.actions.getFragments(s.engine.tags["star"]?.handles || [])
  );

  return (
    <Box>
      <Flex style={{ marginBottom: 20 }}>
        <RouterLink to="/">
          <Link>Back home</Link>
        </RouterLink>
      </Flex>

      <Flex>
        <NewFragment />
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
            <Flex style={{ marginBottom: 20 }} key={fragment.handle}>
              <Fragment
                fragment={fragment}
                // onDelete={(uuid) => uuid && onDelete(uuid)}
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
            ?.filter(
              (f) => !starFragments?.find((st) => st.handle === f.handle)
            )
            .map((fragment) => (
              <Flex style={{ marginBottom: 20 }} key={fragment.handle}>
                <Fragment
                  fragment={fragment}
                  // onDelete={(handle) => handle && onDelete(handle)}
                  saveOnBlur
                />
              </Flex>
            ))}
        </>
      )}
    </Box>
  );
};
