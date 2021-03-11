// contours_tracer.ts
/**
 *
 * Includes types and functions for blob region
 * contour processing.
 */
import ndarray = require('ndarray');
import { BACKGROUND } from './constants';
import { Contour } from './contour';
import { addPoints, isEqualPoints, Point } from './point';

/**
 * Traces inner or outer contour
 * @param {Point} startPoint - starting point
 * @param {0 | 1} searchDirection - search direction 0: outer contour 1: inner contour
 * @param {number} label - region label
 * @param {ndarray<number>} binaryImage - binaryImage
 * @param {ndarray<number>} labelMap - labelMap
 * @returns The contour starting at startPoint
 */
export const traceContour = (startPoint: Point, searchDirection: 0 | 1, label: number,
        binaryImage: ndarray<number>, labelMap: ndarray<number>): Contour => {
    
    const contour = new Contour();
    const [successorPoint, dNext] = findNextPoint(startPoint, searchDirection, binaryImage, labelMap);
    contour.addPoint(successorPoint);

    let previousPoint = startPoint;
    let currentPoint = successorPoint;
    let done = isEqualPoints(startPoint, successorPoint);
    let d_n = dNext;

    while(!done){
        labelMap.set(currentPoint.y, currentPoint.x, label);
        const dSearch = (d_n + 6) % 8;
        const [newPoint, newDirection] = findNextPoint(currentPoint, dSearch, binaryImage, labelMap);

        d_n = newDirection;
        previousPoint = currentPoint ;
        currentPoint = newPoint ;

        done = isEqualPoints(previousPoint, startPoint) && isEqualPoints(currentPoint, successorPoint);
        if(!done) contour.addPoint(newPoint);
    }
    return contour;
};


/**
 * Find next contour point
 * @param {Point} startPoint - starting point
 * @param {number} direction - search direction
 * @param {ndarray<number>} binaryImage - binaryImage
 * @param {ndarray<number>} labelMap - labelMap
 * @returns Returns next contour point. Return startPoint if no next contour point is found
 */
const findNextPoint = (startPoint: Point, direction: number,
        binaryImage: ndarray<number>, labelMap: ndarray<number>): [Point, number] => {
    
    let d = direction;
    for(let i = 0; i < 6; i++){
        const neighbour = addPoints(startPoint,getNextNeighbourPixel(d));
        if(binaryImage.get(neighbour.y, neighbour.x) === BACKGROUND){
            labelMap.set(neighbour.y,neighbour.x, -1);
            d = (d + 1) % 8;
        }
        else return [neighbour, d];
    }
    return [startPoint, direction];
};
 
const getNextNeighbourPixel = (direction: number): Point => {

    const nextPixel: { [key: number]: Point; } = {
        0: { x: 1, y: 0 },
        1: { x: 1, y: 1 },
        2: { x: 0, y: 1 },
        3: { x: -1, y: 1 },
        4: { x: -1, y: 0 },
        5: { x: -1, y: -1 },
        6: { x: 0, y: -1 },
        7: { x: 1, y: -1 },
    };
    return nextPixel[direction];
};