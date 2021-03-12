// utils.ts
/**
 *
 * Includes image processing util functions
 */
import ndarray = require('ndarray');
import pool from 'ndarray-scratch';
import { FOREGROUND } from '../blob_analysis/constants';
import * as tf from '@tensorflow/tfjs';
import pack = require('ndarray-pack');

/**
 * Check if image is black
 * @param {ndarray<number>} image - Input image
 * @returns {boolean} tur if image is black
 */
export const isImageBlack = (image: ndarray<number>): boolean => {

    const [rows, cols] = image.shape;
    let retVal = true;

    for (let r = 0; r < rows; r++)
        for(let c = 0; c < cols; c++)
            if(image.get(r,c) !== 0){
                retVal = false;
                break;
            }
    return retVal;
};


/**
 * Converts Tf Tensor binary class image
 * (one channel image with class labels 0 or 1 as pixel values)
 * @param {tf.Tensor} tensor - Tensor as class image
 * @returns {ndarray<number>} Binary image as type ndarray
 */
export const tensorToBinaryImage = (tensor: tf.Tensor ): ndarray<number> => {
    
    const [rows, cols] = tensor.shape;
    const data = tensor.arraySync();
    const binaryImage = pack(data);
    const image = pool.zeros(tensor.shape);

    for(let r = 0; r < rows; r++)
        for(let c = 0; c < cols; c++)
            if(binaryImage.get(r,c) === FOREGROUND)
                image.set(r,c,FOREGROUND);

    return image;
};