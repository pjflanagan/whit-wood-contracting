import { useEffect } from "react";

type ScrollHandler = (distance: number) => void;

export function useScroll(scrollHandler: ScrollHandler) {
  useEffect(() => {
    function getScrollTop() {
      return window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
    }
  
    function handleScroll() {
      scrollHandler(getScrollTop());
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  });
}