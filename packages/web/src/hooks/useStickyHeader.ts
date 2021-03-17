import { useEffect, useRef, useState } from "react";

function useStickyHeader(offsetY: number = 0, updatesValues: any[] = []) {
  const previousScrollPosition = useRef<number>(0);

  const [isDetached, setIsDetached] = useState(false);
  const _isDetached = useRef(false);
  const _setIsDetached = (isDetached: boolean) => {
    setIsDetached(isDetached);
    _isDetached.current = isDetached;
  };

  const [isSticky, setIsSticky] = useState(false);
  const _isSticky = useRef(false);
  const _setIsSticky = (isSticky: boolean) => {
    setIsSticky(isSticky);
    _isSticky.current = isSticky;
  };

  const handleScroll = (): void => {
    const windowYOffset = window.pageYOffset;

    if (windowYOffset >= offsetY && !_isDetached.current) {
      _setIsDetached(true);
    } else if (windowYOffset <= offsetY && _isDetached.current) {
      _setIsDetached(false);
    }

    if (windowYOffset < previousScrollPosition.current && !_isSticky.current) {
      _setIsSticky(true);
    } else if (
      windowYOffset > previousScrollPosition.current &&
      _isSticky.current
    ) {
      _setIsSticky(false);
    }

    previousScrollPosition.current = window.pageYOffset;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, false);
    return () => {
      window.removeEventListener("scroll", handleScroll, false);
    };
  }, [...updatesValues]);

  return [isDetached, isSticky];
}

export default useStickyHeader;
