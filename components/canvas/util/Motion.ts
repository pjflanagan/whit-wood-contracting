import { type Point, Geometry } from './Geometry';

export class Motion {

  static isClose(source: number, target: number, threshold: number) {
    return Math.abs(source - target) < threshold;
  }

  static hasReachedPoint(sourcePoint: Point, targetPoint: Point, threshold: number): boolean {
    return Geometry.distance(sourcePoint, targetPoint) < threshold;
  }

  // returns a new position in the direction of a point
  // if the point is closer than the speed, it returns the original point
  static moveTowardsPoint(cur: Point, to: Point, speed: number): Point {
    if (Motion.hasReachedPoint(cur, to, speed)) {
      return cur;
    }
    const angle = Math.atan2(to.y - cur.y, to.x - cur.x);
    return Motion.moveAtAngle(cur, angle, speed);
  }

  // returns a new position in the direction of an angle
  static moveAtAngle(pos: Point, angle: number, speed: number): Point {
    return {
      x: pos.x + Math.cos(angle) * speed,
      y: pos.y + Math.sin(angle) * speed,
    };
  }
}
