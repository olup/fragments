import { format } from "date-fns";
import { useEngine } from "hooks/engine";
import { defaultFragment } from "libs/engine";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce/lib";
import { generateHandle } from "utils";
import { FragmentProps } from "./index";
export const useLogic = ({
  onHandleChange: onHandleChangeParent,
  autoFocus,
  initialContent,
  fragment,
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

  const [handle, setHandle] = useState(fragment?.handle || generateHandle());

  const [content, setContent] = useState<string>(
    fragment?.content || initialContent || ""
  );

  const count = useCallback((content: string) => {
    setC(content.length);
    setW(content.length ? content.split(" ").length : 0);
  }, []);

  const saveFragment = useEngine((s) => s.actions.updateFragment);
  const updateHandle = useEngine((s) => s.actions.updateHandle);
  const deleteFragment = useEngine((s) => s.actions.deleteFragment);

  const onSave = useCallback(async () => {
    if (!content || !isDirty) return;
    const newFragment = {
      ...defaultFragment, // initial zero values
      ...(fragment || {}), // previous fragment, if exists
      handle,
      content,
      updatedAt: new Date().toISOString(),
    };
    const result = await saveFragment(newFragment);

    setIsDirty(false);
    return result;
  }, [isDirty, content, handle, saveFragment]);

  const debouncedSave = useDebouncedCallback(async () => {
    onSave();
  }, 1000);

  const onContentChange = useCallback((newContent: string) => {
    if (content === newContent) return;
    setContent(newContent);
    setIsDirty(true);
    debouncedSave();
  }, []);

  const onHandleChange = (newHandle: string) => {
    setHandle(newHandle.replace(/ /, "-"));
    // setIsDirty(true);
    onHandleChangeParent?.(newHandle);
  };

  const onChangeHandle = () => {
    const oldHandle = fragment?.handle;
    const newHandle = handle;
    if (!oldHandle || oldHandle === newHandle) return;
    updateHandle(oldHandle, newHandle);
  };

  useEffect(() => {
    count(content);
  }, [content, count]);

  const goToHandlePage = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    if (e.ctrlKey || e.metaKey) navigate("/handle/" + e.currentTarget.value);
  };

  const hasBackLinks = !!fragment?.linkedBy?.length;

  const handleBlur = async () => {
    if (saveOnBlur) await onSave();
    onOutsideClick?.();
  };

  const onDelete = () => {
    deleteFragment(handle);
  };

  const parent = useEngine((s) =>
    Object.values(s.engine.fragments).find((f) => f.children?.includes(handle))
  );

  const onDetachFromParent = () => {
    if (!parent?.children) return;
    const children = parent.children?.filter((h) => h !== handle);
    saveFragment({
      ...parent,
      children,
    });
  };

  return {
    setHandle,
    onSave,
    onContentChange,
    onHandleChange,
    goToHandlePage,
    onChangeHandle,
    setUseSpellCheck,
    handleBlur,
    setShowCount,
    onDelete,
    onDetachFromParent,
    parent,
    showCount,
    hasBackLinks,
    useSpellCheck,
    handle,
    w,
    c,
  };
};
