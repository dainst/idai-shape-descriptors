import { Point } from './point';
export class Contour {
    points: Point[] = [];

    addPoint = (point: Point): void => {
        this.points.push(point);
    };
}