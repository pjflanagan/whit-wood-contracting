import React, { useRef } from "react";
import { SocialIconRow } from "../social-icon-row";
import Style from "./style.module.scss";
import { ScrollDownButton } from "../scroll-down-button";
import { useScroll } from "../../hooks";

const PARALLAX_RATE = 1 / 4;

type SlideshowProps = {
  title: string;
};

export function Slideshow({ title }: SlideshowProps) {
  const slideshowRef = useRef<HTMLDivElement>(null);

  function handleScroll(scrollTop: number) {
    if (!slideshowRef.current) {
      return;
    }
    slideshowRef.current.style.top = `${-scrollTop * PARALLAX_RATE}px`;
  }

  useScroll(handleScroll);

  return (
    <div className={Style["slideshow"]} ref={slideshowRef}>
      <div className={Style["header"]}>
        <div className={Style["logo-holder"]}>
          <img src="/img/logo/logo.png" width="28" height="38" alt={title} />
        </div>
        <div className={Style["title-holder"]}>
          <h1>{title}</h1>
        </div>
        <SocialIconRow />
      </div>
      <div className={Style["scroll-down-button-holder"]}>
        <ScrollDownButton color="light" targetId="sidebar" />
      </div>
    </div>
  );
}
