import { type Point } from './Geometry';
import type {
  DrawingInstructions,
  DrawingModifiers,
  LayerInstruction,
  LayerModifiers,
  StrokeInstruction,
} from './canvasTypes';

function drawStroke(
  ctx: CanvasRenderingContext2D,
  step: StrokeInstruction,
  position?: Point,
): void {
  const { x, y } = position || { x: 0, y: 0 };
  const [moveType] = step;
  switch (moveType) {
    case 'moveTo':
      ctx.moveTo(x + step[1], y + step[2]);
      break;
    case 'lineTo':
      ctx.lineTo(x + step[1], y + step[2]);
      break;
    case 'quadraticCurveTo':
      ctx.quadraticCurveTo(x + step[1], y + step[2], x + step[3], y + step[4]);
      break;
    case 'arc':
      ctx.arc(x + step[1], y + step[2], step[3], step[4], step[5], step[6]);
      break;
    case 'rect':
      ctx.rect(x + step[1], y + step[2], step[3], step[4]);
      break;
    case 'ellipse':
      ctx.ellipse(x + step[1], y + step[2], step[3], step[4], step[5], step[6], step[7], step[8]);
      break;
    default:
      throw `Unrecognized moveType [${moveType}] in step`;
  }
}

function drawLayer(
  ctx: CanvasRenderingContext2D,
  layer: LayerInstruction,
  position?: Point,
  modifiers?: LayerModifiers,
): void {
  ctx.beginPath();

  try {
    layer.strokes.forEach((s) => drawStroke(ctx, s, position));
  } catch (e) {
    throw `Error in shape [id: ${layer.id}]: ${e}`;
  }

  const fillStyle = modifiers?.fillStyle || layer.fillStyle;
  if (fillStyle) {
    if (typeof fillStyle === 'string') {
      ctx.fillStyle = fillStyle;
    } else {
      if (fillStyle.type === 'PREDEFINED') {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ctx.fillStyle = fillStyle.gradient!;
      } else {
        // ctx.fillStyle = Canvas.createLinearGradient(ctx, fillStyle);
      }
    }
    ctx.fill();
  }
  if (layer.strokeStyle) {
    if (layer.lineDash) {
      ctx.setLineDash(layer.lineDash);
    }
    ctx.strokeStyle = layer.strokeStyle;
    ctx.lineWidth = layer.lineWidth || 1;
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

export class Canvas {
  // Draws a fix shape that can be moved (not rotated or resized)
  // If you want to draw something with some parts fixed and some parts variable, you will have to do so manually
  static draw(
    ctx: CanvasRenderingContext2D,
    instructions: DrawingInstructions,
    modifiers?: DrawingModifiers,
  ): void {
    const drawingPosition = modifiers?.position || instructions.position;
    // const drawingRotation = modifiers?.rotation || instructions.rotation;
    instructions.layers.forEach((l) => {
      const shapeModifiers = modifiers?.layerModifiers?.find((m) => m.id === l.id);
      drawLayer(ctx, l, drawingPosition, shapeModifiers);
    });
  }
}
