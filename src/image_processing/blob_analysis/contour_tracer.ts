// contours_tracer.ts
/**
 *
 * Includes types and functions for blob region
 * contour processing.
 */
import { BACKGROUND } from './constants';
import { Contour } from './contour';
import { addPoints, arePointsEqual, Point } from './point';
import * as tf from '@tensorflow/tfjs';
import { getEntryFromTensor2D, setEntryOfTensor2D } from '../utils/utils';

/**
 * Traces inner or outer contour
 * @param {Point} startPoint - starting point
 * @param {0 | 1} searchDirection - search direction 0: outer contour 1: inner contour
 * @param {number} label - region label
 * @param {tf.Tensor2D} binaryImage - binaryImage
 * @param {tf.Tensor2D} labelMap - labelMap
 * @returns The contour starting at startPoint
 */
export const traceContour = (startPoint: Point, searchDirection: 0 | 1, label: number,
        binaryImage: tf.Tensor2D, labelMap: tf.Tensor2D): Contour => {
    
    const contour = new Contour();
    const [successorPoint, dNext] = findNextPoint(startPoint, searchDirection, binaryImage, labelMap);
    contour.addPoint(successorPoint);

    let previousPoint = startPoint;
    let currentPoint = successorPoint;
    let done = arePointsEqual(startPoint, successorPoint);
    let d_n = dNext;

    while(!done){
        setEntryOfTensor2D(labelMap, currentPoint, label);
        const dSearch = (d_n + 6) % 8;
        const [newPoint, newDirection] = findNextPoint(currentPoint, dSearch, binaryImage, labelMap);

        d_n = newDirection;
        previousPoint = currentPoint ;
        currentPoint = newPoint ;

        done = arePointsEqual(previousPoint, startPoint) && arePointsEqual(currentPoint, successorPoint);
        if(!done) contour.addPoint(newPoint);
    }
    return contour;
};


/**
 * Find next contour point
 * @param {Point} startPoint - starting point
 * @param {number} direction - search direction
 * @param {tf.Tensor2D} binaryImage - binaryImage
 * @param {tf.Tensor2D} labelMap - labelMap
 * @returns Returns next contour point. Return startPoint if no next contour point is found
 */
const findNextPoint = (startPoint: Point, direction: number,
        binaryImage: tf.Tensor2D, labelMap: tf.Tensor2D): [Point, number] => {
    
    let d = direction;
    for(let i = 0; i < 6; i++){
        const neighbour = addPoints(startPoint,getNextNeighbourPixel(d));
        if(getEntryFromTensor2D(binaryImage, neighbour.y, neighbour.x) === BACKGROUND){
            setEntryOfTensor2D(labelMap,neighbour, -1);
            //labelMap.set(neighbour.y,neighbour.x, -1);
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