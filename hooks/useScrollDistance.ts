import { useEffect, useState } from "react";
import { getSourceElement } from "../util";

export function useScrollDistance(sourceElementId: string | undefined): number {
  const [scrollDistance, setScrollDistance] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollDistance = sourceElementId
        ? document.getElementById(sourceElementId)?.scrollTop
        : window.scrollY;
      setScrollDistance(scrollDistance || 0);
    }

    const sourceElement = getSourceElement(sourceElementId);
    sourceElement?.addEventListener("scroll", handleScroll);
    return () => {
      sourceElement?.removeEventListener("scroll", handleScroll);
    };
  });

  return scrollDistance;
}