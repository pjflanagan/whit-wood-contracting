import React from "react";
import { Icon } from "../";
import Style from "./style.module.scss";
import animateScrollTo from "animated-scroll-to";
import classNames from "classnames";
import { getSourceElement } from "../../util";
import { useScrollDistance } from "../../hooks";

const HIDE_BUTTON_SCROLL_DISTANCE = 180;

type ScrollDownButtonProps = {
  sourceId?: string;
  targetId: string;
  color?: "light" | "dark";
};

export function ScrollDownButton({
  sourceId,
  targetId,
  color = "light",
}: ScrollDownButtonProps) {
  const scrollDistance = useScrollDistance(sourceId);

  function handleClick() {
    const sourceElement = getSourceElement(sourceId);
    const targetElement = document.getElementById(targetId);
    if (sourceElement && targetElement) {
      animateScrollTo(targetElement.offsetTop, {
        elementToScroll: sourceElement,
        minDuration: 400,
      });
    }
  }

  const className = classNames(Style["scroll-down-button"], Style[color]);
  const opacity = Math.max(1 - scrollDistance / HIDE_BUTTON_SCROLL_DISTANCE, 0);
  return (
    // CONSIDER: the <a> tag. I like getting /#events but I don't like /#sidebar
    // <a href={`#${targetId}`} >
    <div className={className} style={{ opacity }} onClick={handleClick}>
      <Icon name="south" />
    </div>
    // </a>
  );
}
