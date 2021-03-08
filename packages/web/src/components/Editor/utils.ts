import { Editor, Node, Text } from "slate";
import { LEAF_REGEX, SHORTCUTS } from "./constant";
export const serialize = (input: string): Node[] => {
  return input.split("\n").map((text) => {
    let type = "paragraph";
    // Object.keys(SHORTCUTS).forEach((short) => {
    //   if (text?.match(new RegExp(short))) {
    //     type = SHORTCUTS[short];
    //   }
    // });

    return {
      type,
      children: [{ text }],
    };
  });
};

export const decorate = ([node, path]: any) => {
  const ranges: any[] = [];

  if (Text.isText(node)) {
    const { text } = node;

    Object.keys(LEAF_REGEX).forEach((k) => {
      var re = new RegExp(k, "gim");

      let match;
      while ((match = re.exec(text)) !== null) {
        const start = match.index;
        const end = match.index + match[0].length;

        ranges.push({
          anchor: { path, offset: start },
          focus: { path, offset: end },
          type: LEAF_REGEX[k],
        });
      }
    });
  }

  return ranges;
};

export const withNormalize = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    normalizeNode(entry);
  };

  return editor;
};

export const withNestedEditor = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "editor" ? true : isVoid(element);
  };

  return editor;
};

export const deserialize = (editorState: Node[]) => {
  return editorState
    .filter((n) => {
      return !n.preventSerialization;
    })
    .map((n) => Node.string(n))
    .join("\n");
};
