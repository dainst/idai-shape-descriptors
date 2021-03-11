// utils.ts
/**
 *
 * Includes image processing util functions
 */
import ndarray = require('ndarray');

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