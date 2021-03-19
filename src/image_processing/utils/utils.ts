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
 * @returns {boolean} True if image is black
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


/**
 * Converts RGB image to grayscale image
 * @param {tf.Tensor3D} rgbImage - RGB image
 * @param {number} scale - Value to scale eacht image pixel
 * @returns {tf.Tensor2D} Grayscale image
 */
export const rgbToGrayscale = (rgbImage: tf.Tensor3D, scale: number = 1): tf.Tensor2D => {
  
    const [rows, cols, _] = rgbImage.shape;
    const [r, g, b] = tf.split(rgbImage, 3, 2);
    const gray = tf.addN([
        tf.mul(r, tf.scalar(0.3)),
        tf.mul(g, tf.scalar(0.59)),
        tf.mul(b, tf.scalar(0.11))
    ]);
    const out = scale !== 1 ? tf.mul(gray, tf.scalar(1 / scale)) : gray;
    
    return tf.cast(out,'int32').reshape([rows, cols]) as tf.Tensor2D;
};