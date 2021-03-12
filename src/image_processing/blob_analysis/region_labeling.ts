// region_labeling.ts
/**
 *
 * Includes functions for blob region
 * labeling and contour detection
 */
import { BinaryRegion } from './binary_region';
import { BACKGROUND, FOREGROUND } from './constants';
import { traceContour } from './contour_tracer';
import { Point } from './point';
import * as tf from '@tensorflow/tfjs';
import { getEntryFromTensor2D, setEntryOfTensor2D } from '../utils/utils';


/**
 * Detect blob regions and their inner and outer contours
 * See W. Burger Digital Image Processing An Algorithmic Introduction - p. 220
 * for detailed describtion.
 * @param {tf.Tensor2D} image - Input image
 * @returns The sets of outer and inner contours and a label map.
 */
export const regionLabeling = (image: tf.Tensor2D): [BinaryRegion[], tf.Tensor2D] => {
 
    const [labelMap, zeroEmbeddedImage] = createLabelMap(image);
    const [rows, cols] = zeroEmbeddedImage.shape;
    let currentLabel = 1;
    const regions: BinaryRegion[] = [];

    for(let r = 0; r < rows; r++){
        for(let c = 1; c < cols; c++){
            const point: Point = { x: c, y: r };
            if(isOuterContour(labelMap, zeroEmbeddedImage, point)){
                const cnt = traceContour(point, 0, currentLabel, zeroEmbeddedImage, labelMap);
                regions.push(new BinaryRegion(currentLabel));
                regions[currentLabel - 1].setOuterContour(cnt);
                currentLabel += 1;
            } else if(isInnerContour(labelMap, zeroEmbeddedImage, point)){
                const regLabel = getEntryFromTensor2D(labelMap, point.y, point.x - 1);
                const cnt = traceContour({ x: point.x - 1, y: point.y }, 1,
                                regLabel , zeroEmbeddedImage, labelMap);
                regions[regLabel - 1].addInnerContour(cnt);
            } else if(isRegionPixel(labelMap, zeroEmbeddedImage, point)){
                const regLabel = getEntryFromTensor2D(labelMap, point.y, point.x - 1);
                setEntryOfTensor2D(labelMap, point, regLabel);
                regions[regLabel - 1].addRegionPixel(point);
            }
            
          
        }
    }

    return [regions, labelMap];
};


/**
 * Creates the label map and a zero embedded image
 * Zero embedded image is used to simplify contour tracing
 * and eliminates the need to handle number of special situations
 * @param {tf.Tensor2D} image - input image
 */
const createLabelMap = (image: tf.Tensor2D): [tf.Tensor2D, tf.Tensor2D] => {
    const zeroEmbeddedImage = image.pad([[1, 1],[1,1]]) as tf.Tensor2D;
    const labelMap = tf.zeros(zeroEmbeddedImage.shape) as tf.Tensor2D;
    
    return [labelMap, zeroEmbeddedImage];
};


const isOuterContour = (labelMap: tf.Tensor2D, zeroEmbeddedImage:tf.Tensor2D, point: Point): boolean =>
    getEntryFromTensor2D(zeroEmbeddedImage, point.y, point. x) === FOREGROUND &&
    getEntryFromTensor2D(zeroEmbeddedImage, point.y, point. x - 1) === BACKGROUND &&
    getEntryFromTensor2D(labelMap, point.y, point. x) === 0;
    

const isInnerContour = (labelMap: tf.Tensor2D, zeroEmbeddedImage:tf.Tensor2D, point: Point): boolean =>
    getEntryFromTensor2D(zeroEmbeddedImage, point.y, point.x) === BACKGROUND &&
    getEntryFromTensor2D(zeroEmbeddedImage, point.y, point.x - 1) === FOREGROUND &&
    getEntryFromTensor2D(labelMap, point.y, point. x) !== -1;


const isRegionPixel = (labelMap: tf.Tensor2D, zeroEmbeddedImage:tf.Tensor2D, point: Point): boolean =>
    getEntryFromTensor2D(zeroEmbeddedImage, point.y, point.x) === FOREGROUND &&
    getEntryFromTensor2D(zeroEmbeddedImage, point.y, point.x - 1) === FOREGROUND &&
    getEntryFromTensor2D(labelMap, point.y, point. x) === 0;