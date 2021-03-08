import React from "react";
import { Code } from "./Code";
import { Handle } from "./Handle";
import { Tag } from "./Tag";

export const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.type === "handle")
    return (
      <Handle text={leaf.text} {...attributes}>
        {children}
      </Handle>
    );

  if (leaf.type === "inlineHandle")
    return (
      <Handle text={leaf.text} inline {...attributes}>
        {children}
      </Handle>
    );

  if (leaf.type === "hashtag")
    return (
      <Tag {...attributes} text={leaf.text}>
        {children}
      </Tag>
    );

  if (leaf.type === "code") return <Code {...attributes}>{children}</Code>;
  return (
    <span
      style={{
        fontWeight: leaf.type === "bold" ? "bold" : "normal",
        fontStyle: leaf.type === "italic" ? "italic" : "normal",
      }}
      {...attributes}
    >
      {children}
    </span>
  );
};
