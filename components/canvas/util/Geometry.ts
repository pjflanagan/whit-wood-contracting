export type Point = {
  x: number;
  y: number;
};

export type Point3D = Point & {
  z: number;
};

export const ZERO_POINT = { x: 0, y: 0 };

export class Geometry {
  static difference(a: Point, b: Point): Point {
    return {
      x: a.x - b.x,
      y: a.y - b.y
    }
  }

  static distance(a: Point, b: Point) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }

  static isEqual(a: Point, b: Point): boolean {
    return a.x === b.x && a.y === b.y;
  }
}
