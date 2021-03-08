import { InlineEditor } from "components/InlineEditor";
import React from "react";
import { useForbidenHandlesContext } from "../context";

export const BlockElement = ({ attributes, children, element }: any) => {
  const forbidenHandles = useForbidenHandlesContext();

  switch (element.type) {
    case "editor-pre-handle":
      return <div {...attributes}>{children}</div>;
    case "pre-code-fence":
      return (
        <div {...attributes} style={{ opacity: 0.1 }}>
          {children}
        </div>
      );
    case "code":
      return (
        <div
          {...attributes}
          style={{
            backgroundColor: "#353535",
            color: "#ccc",
            padding: "5px 30px",
            margin: "0px -30px",
          }}
        >
          {children}
        </div>
      );
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "heading-three":
      return <h3 {...attributes}>{children}</h3>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "comment":
      return (
        <p {...attributes} style={{ opacity: 0.5 }}>
          {children}
        </p>
      );
    case "editor":
      if (forbidenHandles.includes(element.handle))
        return <div {...attributes}>{children}</div>;
      return (
        <div {...attributes}>
          <div
            contentEditable={false}
            style={{ margin: "0px -30px 10px -30px" }}
          >
            <span style={{ display: "none" }}>{children}</span>
            <div
              contentEditable={false}
              style={{
                padding: "10px 30px",
                backgroundColor: "rgb(241 241 241 / 45%)",
                marginTop: -2,
              }}
            >
              <InlineEditor handle={element.handle} />
            </div>
          </div>
        </div>
      );
    default:
      return (
        <p {...attributes} className={element.type}>
          {children}
        </p>
      );
  }
};
