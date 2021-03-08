import React from "react";
import {
  useGetFragmentByHandleQuery,
  useSaveFragmentMutation,
} from "graphql/generated";
import { FC, Fragment } from "react";
import { Editor } from "./Editor";
import { useState } from "react";

export const InlineEditor: FC<{ handle?: string }> = ({ handle = "" }) => {
  const { data, loading } = useGetFragmentByHandleQuery({
    variables: { handle },
    fetchPolicy: "cache-and-network",
  });
  const fragment = data?.fragmentByHandle;
  const [save] = useSaveFragmentMutation();

  const onSave = (content: string) => {
    if (loading) return;
    save({
      variables: {
        fragment: { uuid: fragment?.uuid, handle, content },
      },
    });
  };

  return (
    <Editor
      key={fragment?.uuid}
      initialValue={fragment?.content || ""}
      onSave={onSave}
      autoSave
      handle={handle}
    />
  );
};
