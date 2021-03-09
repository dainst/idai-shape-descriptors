// contours_tracer.ts
/**
 *
 * Includes types and functions for blob region
 * contour processing.
 */
import ndarray = require('ndarray');
import { BACKGROUND } from './constants';
import { addPoints, Point } from './point';

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
            d = (d+1) % 8;
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