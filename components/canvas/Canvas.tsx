import { useEffect, useRef } from "react";
import { GuitarVisual } from "./GuitarVisual";
import Style from "./style.module.scss";

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visual = useRef<GuitarVisual>();

  useEffect(() => {
    function setupCanvas() {
      if (!canvasRef.current) {
        return;
      }
      const context = canvasRef.current.getContext("2d");
  
      if (!context) {
        throw "Unable to get canvas context";
      }
  
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
  
      visual.current = new GuitarVisual(context);
      visual.current.setup();
      visual.current.start();
  
      // we list on the body element because the canvas has pointer events disabled
      // (it covers the whole screen and would block important elements)
      document.body.addEventListener(
        "mousemove",
        visual.current!.handleMouseMove
      );
    }
  
    function resetupCanvas() {
      visual.current?.stop();
      if (visual.current) {
        document.body.removeEventListener('mousemove', visual.current.handleMouseMove);
      }
      setupCanvas();
    }

    setupCanvas();
    window.addEventListener("resize", resetupCanvas);

    return () => {
      visual.current?.stop();
      if (visual.current) {
        document.body.removeEventListener('mousemove', visual.current.handleMouseMove);
      }
      window.removeEventListener("resize", resetupCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className={Style["canvas"]} />;
}
