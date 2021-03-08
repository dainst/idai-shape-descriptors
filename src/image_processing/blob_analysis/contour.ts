export class Contour {
    points: [number, number][] = [];

    addPoint = (point: [number, number]): void => {
        this.points.push(point);
    };
}