import { useSaveFragmentMutation } from "graphql/generated";
import getHumanId from "human-id";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FragmentDisplayType } from "types";
export const useLogic = (
  fragment?: FragmentDisplayType,
  autoFocus?: boolean
) => {
  const navigate = useNavigate();

  const [isDirty, setIsDirty] = useState(false);
  const [useSpellCheck, setUseSpellCheck] = useState(false);

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
    fragment?.uuid || undefined
  );
  const [content, setContent] = useState<string>(fragment?.content || "");

  const count = useCallback((content: string) => {
    setC(content.length);
    setW(content.length ? content.split(" ").length : 0);
  }, []);

  const [saveFragment, { loading }] = useSaveFragmentMutation();

  const onSave = useCallback(async () => {
    if ((!uuid && !content) || !isDirty || loading) return;
    const result = await saveFragment({
      variables: {
        fragment: {
          content,
          handle,
          uuid,
        },
      },
    });

    const newUuid = result.data?.fragment?.uuid;
    if (!!newUuid && newUuid !== uuid) setUuid(newUuid);

    setIsDirty(false);
    return result;
  }, [isDirty, uuid, content, handle, loading, saveFragment]);

  const onContentChange = useCallback((newContent: string) => {
    if (content === newContent) return;
    setContent(newContent);
    setIsDirty(true);
  }, []);

  const onHandleChange = (handle: string) => {
    setHandle(handle);
    setIsDirty(true);
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

  return {
    hasBackLinks,
    setHandle,
    onSave,
    onContentChange,
    onHandleChange,
    goToHandlePage,
    useSpellCheck,
    setUseSpellCheck,
    handle,
    w,
    c,
    uuid,
  };
};
