import { useEngine } from "contexts/engine";
import React, { FC } from "react";
import { Editor } from "./Editor";

export const InlineEditor: FC<{ handle?: string }> = ({ handle = "" }) => {
  const fragment = useEngine((s) => s.engine.fragments[handle]);
  const updateFragment = useEngine((s) => s.actions.updateFragment);

  const onSave = (content: string) => {
    updateFragment({ handle, content });
  };

  return (
    <Editor
      key={fragment?.handle}
      initialValue={fragment?.content || ""}
      onSave={onSave}
      autoSave
      handle={handle}
    />
  );
};
