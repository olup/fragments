import { useEffect } from "react";

export const useTypeWriterPos = (active = false) => {
  useEffect(() => {
    if (active)
      document.onselectionchange = (e) => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) {
          return;
        }

        const range = sel.getRangeAt(0);
        const position = range.getBoundingClientRect();

        const wHeight = window.innerHeight;
        const xCaretPos = position.bottom;
        const diff = xCaretPos - wHeight;

        if (diff > -110) window.scrollTo({ top: window.scrollY + diff + 150 });
      };
    return () => {
      document.onselectionchange = null;
    };
  }, [active]);
};
