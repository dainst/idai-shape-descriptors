import { Point } from './point';
export class Contour {
    points: Point[] = [];

    addPoint = (point: Point): void => {
        this.points.push(point);
    };
}


export const contourLength = (contour:Contour): number => {
    let perimeter = 0;
    const cnt_points = contour.points.length;
    
    for(let i = 0; i < cnt_points; i++)
        if( contour.points[i % cnt_points].x !== contour.points[(i + 1) % cnt_points].x &&
            contour.points[i % cnt_points].y !== contour.points[(i + 1) % cnt_points].y)
            perimeter += Math.sqrt(2);
        else
            perimeter += 1;
    return perimeter * 0.95;
};