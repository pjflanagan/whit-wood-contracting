import { Canvas } from './util/Canvas';
import { LayerInstruction } from './util/canvasTypes';
import { Geometry, Point } from './util/Geometry';
import { Motion } from './util/Motion';
import type { GuitarVisual } from './GuitarVisual';
import Theme from '../../styles/theme.module.scss';

export const GUITAR_STRING = {
  OFFSCREEN: 120,
  MAX_OFFSET_X: parseInt(Theme.guitarMaxOffsetX!),
  WIDTH: parseInt(Theme.guitarStringWidth!),
}

const SIDEBAR_PADDING = parseInt(Theme.sidebarGuitarOffset!) + 6;

export class GuitarString {
  visual: GuitarVisual;
  position: Point;
  isEndString: boolean;
  pullPoint: Point;
  state: 'held' | 'released';
  to: Point;

  constructor(visual: GuitarVisual, x: number, isEndString = false) {
    this.visual = visual;
    this.position = { x, y: -GUITAR_STRING.OFFSCREEN };

    // used in the UI version to block background
    this.isEndString = isEndString;

    this.pullPoint = this.getDefaultPullPoint();
    this.state = 'released';
    this.to = this.pullPoint;
  }

  // sets the pull point and the to point
  setPullPoint(point: Point) {
    this.pullPoint = point;
    this.setNextToPoint();
  }

  setRandomInitialPullPoint() {
    const { H } = this.visual.getSize();
    this.setPullPoint({
      // x: Math.round(Math.random() * 2) - 1 * GUITAR_STRING.MAX_OFFSET_X, // NOTE: no
      x: GUITAR_STRING.MAX_OFFSET_X, // NOTE: no reason to randomize the x value because it's symetrical anyway
      y: Math.floor(Math.random() * H)
    })
  }

  getDefaultPullPoint() {
    const { H } = this.visual.getSize();
    return { x: 0, y: H / 2 + GUITAR_STRING.OFFSCREEN };
  }

  setNextToPoint() {
    const defaultPoint = this.getDefaultPullPoint();

    // this.to will be set to (-1 * pullPoint.x, y - 1) once we get there we set a new this.to
    const newX = -1 * Math.sign(this.pullPoint.x) * Math.abs(this.pullPoint.x) - 1;
    const newY = this.pullPoint.y - 14 * Math.sign(this.pullPoint.y - defaultPoint.y);
    this.to = { x: newX, y: newY };

    // if the to point is close to the default, then just use the default
    if (Geometry.distance(this.to, defaultPoint) < 12) {
      this.to = defaultPoint;
    }
  }

  // moves the pull point with respect to itself
  movePullPoint() {
    this.pullPoint = Motion.moveTowardsPoint(this.pullPoint, this.to, 2);
  }

  shouldStop() {
    const defaultPoint = this.getDefaultPullPoint();
    return (
      Geometry.distance(this.pullPoint, defaultPoint) < 3
      && Geometry.isEqual(this.to, defaultPoint)
    );
  }

  move() {
    const { mousePos } = this.visual.getUserPosition();

    // if the pointer has reached the string
    if (Motion.isClose(mousePos.x, this.position.x, 12)) {
      // we consider the string being held
      this.state = 'held';
    } else if (!Motion.isClose(mousePos.x, this.position.x, GUITAR_STRING.MAX_OFFSET_X)) {
      // if we pass the max offset, it has been released
      this.state = 'released';
    }

    if (this.state === 'held') {
      // if it's held then the pull point is the mouse position and we should prep the next to point
      this.setPullPoint(Geometry.difference(mousePos, this.position));
    } else if (!this.shouldStop()) {
      // Otherwise we have released and we should move the pull point
      this.movePullPoint();
      // If we are close to the to point, set a new to point
      if (Geometry.distance(this.pullPoint, this.to) < 3) {
        this.setNextToPoint();
      }
    }
  }

  draw() {
    const { H } = this.visual.getSize();
    const maxH = H + GUITAR_STRING.OFFSCREEN * 2;
    const endStringBlockerLayer: LayerInstruction[] = this.isEndString ? [{
      id: 'endStringBlocker',
      strokes: [
        ['moveTo', 0, 0],
        ['quadraticCurveTo', this.pullPoint.x, this.pullPoint.y, 0, maxH],
        ['lineTo', SIDEBAR_PADDING, maxH],
        ['lineTo', SIDEBAR_PADDING, 0],
        ['lineTo', 0, 0],
      ],
      lineWidth: GUITAR_STRING.WIDTH,
      fillStyle: Theme.background,
    }] : [];
    Canvas.draw(this.visual.getContext(), {
      position: this.position,
      layers: [
        ...endStringBlockerLayer,
        {
          id: 'string',
          strokes: [
            ['moveTo', 0, 0],
            ['quadraticCurveTo', this.pullPoint.x, this.pullPoint.y, 0, maxH],
          ],
          lineWidth: GUITAR_STRING.WIDTH,
          strokeStyle: Theme.stringColor,
        },
        // DEBUG:
        // {
        //   id: 'pull',
        //   strokes: [['arc', this.pullPoint.x, this.pullPoint.y, 4, 0, 2 * Math.PI, false]],
        //   fillStyle: '#f00'
        // },
        // {
        //   id: 'to',
        //   strokes: [['arc', this.to.x, this.to.y, 4, 0, 2 * Math.PI, false]],
        //   fillStyle: '#0f0'
        // }
      ]
    });
  }
}
