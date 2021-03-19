import { useEngine } from "contexts/engine";
import { useSaveFragmentMutation } from "graphql/generated";
import getHumanId from "human-id";
import { deleteFragment } from "libs/github";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router-dom";
import { FragmentDisplayType } from "types";
import { useDebouncedCallback } from "use-debounce/lib";
import { FragmentProps } from "./index";
export const useLogic = ({
  fragment,
  autoFocus,
  onHandleChange: onHandleChangeParent,
  initialContent,
  saveOnBlur,
  autoSave,
  onBlur: onOutsideClick,
}: FragmentProps) => {
  const navigate = useNavigate();

  const [isDirty, setIsDirty] = useState(false);
  const [useSpellCheck, setUseSpellCheck] = useState(false);
  const [showCount, setShowCount] = useState(false);

  const [c, setC] = useState(0);
  const [w, setW] = useState(0);

  const [handle, setHandle] = useState(
    fragment?.handle ||
      getHumanId({
        separator: "-",
        capitalize: false,
      })
  );
  const [uuid, setUuid] = useState<string | undefined>(
    fragment?.handle || undefined
  );
  const [content, setContent] = useState<string>(
    fragment?.content || initialContent || ""
  );

  const count = useCallback((content: string) => {
    setC(content.length);
    setW(content.length ? content.split(" ").length : 0);
  }, []);

  const saveFragment = useEngine((s) => s.actions.updateFragment);

  const onSave = useCallback(async () => {
    if ((!uuid && !content) || !isDirty) return;
    const result = await saveFragment({ handle, content });

    setIsDirty(false);
    return result;
  }, [isDirty, uuid, content, handle, saveFragment]);

  const debouncedSave = useDebouncedCallback(async () => {
    onSave();
  }, 1000);

  const onContentChange = useCallback((newContent: string) => {
    if (content === newContent) return;
    setContent(newContent);
    setIsDirty(true);
    if (autoSave) debouncedSave();
  }, []);

  const onHandleChange = (handle: string) => {
    setHandle(handle);
    setIsDirty(true);
    onHandleChangeParent?.(handle);
  };

  useEffect(() => {
    count(content);
  }, [content, count]);

  const goToHandlePage = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    if (e.ctrlKey || e.metaKey) navigate("/handle/" + e.currentTarget.value);
  };

  // const hasBackLinks = !!fragment?.linkedBy?.length;

  const handleBlur = async () => {
    if (saveOnBlur) await onSave();
    onOutsideClick?.();
  };

  useHotkeys("ctrl+s", (e) => {
    e.preventDefault();
    onSave();
  });

  return {
    setHandle,
    onSave,
    onContentChange,
    onHandleChange,
    goToHandlePage,
    setUseSpellCheck,
    handleBlur,
    setShowCount,
    showCount,
    //hasBackLinks,
    useSpellCheck,
    handle,
    w,
    c,
    uuid,
  };
};
