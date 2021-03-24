import { Fragment } from "components/Fragment";
import { Flex } from "components/Layout";
import { Link } from "components/Link";
import { useEngine } from "hooks/engine";
import React from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

export const FragmentPage = () => {
  const { handle } = useParams();

  const fragment = useEngine((s) => s.engine.fragments[handle]);
  const deleteFragment = useEngine((s) => s.actions.deleteFragment);

  const onHandleChange = (newHandle: string) => {
    window.history.pushState(undefined, "", newHandle);
  };

  return (
    <>
      <Flex style={{ marginBottom: 20 }}>
        <RouterLink to="/">
          <Link>Back home</Link>
        </RouterLink>
      </Flex>

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
        onDelete={() => deleteFragment(fragment.handle)}
        saveOnBlur
      />
    </>
  );
};
