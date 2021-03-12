// utils.ts
/**
 *
 * Includes image processing util functions
 */
import * as tf from '@tensorflow/tfjs';
import { Point } from '../blob_analysis/point';

/**
 * Check if image is black
 * @param {tf.Tensor2D} image - Input image
 * @returns {boolean} tur if image is black
 */
export const isImageBlack = (image: tf.Tensor2D): boolean => {

    const [rows, cols] = image.shape;
    let retVal = true;

    for (let r = 0; r < rows; r++)
        for(let c = 0; c < cols; c++)
            if(getEntryFromTensor2D(image, r, c) !== 0){
                retVal = false;
                break;
            }
    return retVal;
};


export const getEntryFromTensor2D = (x: tf.Tensor2D , row: number, col: number): number => x.bufferSync().get(row,col);

export const setEntryOfTensor2D = (x: tf.Tensor2D , point: Point, value: number): void =>
    x.bufferSync().set(value,point.y, point.x );