import { createDraft, finishDraft } from "immer";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { createEditor, Node, Transforms } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { useDebouncedCallback } from "use-debounce/lib";
import { SHORTCUTS } from "./constant";
import { ForbidenHandlesProvider, useForbidenHandlesContext } from "./context";
import { BlockElement } from "./decorators/BlockElement";
import { Leaf } from "./decorators/Leaf";
import { EditorStyled } from "./styles";
import {
  decorate,
  serialize,
  deserialize,
  withNormalize,
  withNestedEditor,
} from "./utils";

type EditorProps = {
  initialValue?: string;
  onChange?: (content: string) => any;
  onSave?: (content: string) => any;
  autoSave?: boolean;
  spellCheck?: boolean;
  autoFocus?: boolean;
  onBlur?: (e: any) => any;
  handle?: string;
  forbiddenInlineHandles?: string[];
};
export const Editor: FC<EditorProps> = ({
  onChange: onChangeParent,
  handle = "",
  initialValue = "",
  autoFocus,
  autoSave = false,
  spellCheck = false,
  onSave,
  onBlur,
}) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (autoFocus) editorRef.current?.focus();
  }, [autoFocus]);

  const [editorState, setEditorState] = useState(serialize(initialValue));
  const [selectionState, setSelectionState] = useState<any>(null);

  const editor = useMemo(
    () => withReact(withNestedEditor(withNormalize(createEditor()))),
    []
  );

  const debouncedSave = useDebouncedCallback(async () => {
    onSave?.(deserialize(editorState));
  }, 1000);

  const handleBlur = (e: any) => {
    onBlur?.(e);
    onSave?.(deserialize(editorState));
  };

  const onChange = (value: any) => {
    // This method might be crazy ineficient. Might be better to serialize the whole doc JSUT ONCE and the work
    // by edited line and trigger rerender only on selected event.

    // immerize collection
    const _value: any[] = createDraft(value);
    const _selection = createDraft(editor.selection || {});

    let lastCodeFenceIndex: number | null = null;

    _value.forEach((node: any, i: number) => {
      if (node.type !== "editor" && node?.children?.[0]?.text === "") {
        node.type = "paragraph";
      }

      Object.keys(SHORTCUTS).forEach((short) => {
        if (node.children[0].text?.match(new RegExp(short))) {
          node.type = SHORTCUTS[short];
        }
      });

      // Code fence makes code blocks
      if (node?.children?.[0]?.text === "```") {
        if (lastCodeFenceIndex) {
          node.type = "pre-code-fence";
          _value[lastCodeFenceIndex].type = "pre-code-fence";
          _value
            .slice(lastCodeFenceIndex + 1, i)
            .forEach((n: any) => (n.type = "code"));
          lastCodeFenceIndex = null;
        } else {
          lastCodeFenceIndex = i;
        }
      }

      // inline regex is followed by editor
      if (node.children[0].text?.match(new RegExp("^@[a-zA-Z-]+:inline$"))) {
        node.type = "editor-pre-handle";
        if (_value[i + 1].type !== "editor") {
          _value.splice(i + 1, 0, {
            type: "editor",
            preventSerialization: true,
            handle: node.children[0].text
              .replace("@", "")
              .replace(":inline", ""),
            children: [{ text: "" }],
          });
        }
      }

      // editor node must have an inline regex before
      if (node.type === "editor") {
        if (_value[i - 1].type !== "editor-pre-handle") {
          _value.splice(i, 1);
        }
      }
    });

    // de-immerize collection
    const editorContent: Node[] = finishDraft(_value);
    const editorSelection = finishDraft(_selection);

    // we batch our state updates so our children and selection stay in sync
    setEditorState(editorContent);
    setSelectionState(editorSelection);

    // fire top editor component onChange event
    onChangeParent?.(deserialize(editorContent));

    // fire save event
    if (autoSave) debouncedSave.callback();
  };

  // serialize live on first mount
  useEffect(() => {
    onChange(editorState);
  }, []);

  // update editor selection with our object
  useEffect(() => {
    if (selectionState) {
      Transforms.setSelection(editor, selectionState);
    }
  }, [selectionState]);

  // find forbiden inline handles
  const forbidenHandles = useForbidenHandlesContext();

  return (
    <ForbidenHandlesProvider value={[...forbidenHandles, handle]}>
      <EditorStyled>
        <Slate
          editor={editor}
          value={editorState}
          onChange={onChange}
          ref={editorRef}
        >
          <Editable
            renderElement={BlockElement}
            autoFocus
            decorate={decorate}
            renderLeaf={Leaf}
            onBlur={handleBlur}
            spellCheck={spellCheck}
          />
        </Slate>
      </EditorStyled>
    </ForbidenHandlesProvider>
  );
};
