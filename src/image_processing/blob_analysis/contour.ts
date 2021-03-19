import { BinaryRegion } from './binary_region';
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


/**
 * Find region with longest outer contour and return its outer contour.
 * @param { BinaryRegion[] } regions - Array of binary regions
 * @returns { Contour } Outer contour of region with longest outer contour.
 */
export const getLongesOuterContourOfRegions = (regions: BinaryRegion[]): Contour => {
    
    regions.sort((a, b) =>
        contourLength(b.getOuterContour()) -
        contourLength(a.getOuterContour()));
    return regions[0].getOuterContour();
};