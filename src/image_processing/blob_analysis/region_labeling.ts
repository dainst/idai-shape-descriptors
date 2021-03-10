// region_labeling.ts
/**
 *
 * Includes functions for blob region
 * labeling and contour detection
 */
import ndarray = require('ndarray');
import pool = require('ndarray-scratch');
import { BinaryRegion } from './binary_region';
import { BACKGROUND, FOREGROUND } from './constants';
import { traceContour } from './contour_tracer';
import { Point } from './point';


/**
 * Detect blob regions and their inner and outer contours
 * See W. Burger Digital Image Processing An Algorithmic Introduction - p. 220
 * for detailed describtion.
 * @param {ndarray<number>} image - Input image
 * @returns The sets of outer and inner contours and a label map.
 */
export const regionLabeling = (image: ndarray<number>): [BinaryRegion[], ndarray<number>] => {
 
    const [labelMap, zeroEmbeddedImage] = createLabelMap(image);
    const [rows, cols] = zeroEmbeddedImage.shape;
    let currentLabel = 1;
    const regions: BinaryRegion[] = [];

    for(let r=0; r < rows; ++r){
        for(let c=0; c < cols; ++c){
            const point: Point = { x: c, y: r };
            if(isOuterContour(labelMap, zeroEmbeddedImage, point)){
                const cnt = traceContour(point, 0, currentLabel, zeroEmbeddedImage, labelMap);
                regions.push(new BinaryRegion(currentLabel));
                regions[currentLabel-1].setOuterContour(cnt);
                currentLabel += 1;
            } else if(isInnerContour(labelMap, zeroEmbeddedImage, point)){
                const reglabel = labelMap.get(point.y, point.x - 1);

                const cnt = traceContour({ x: point.x -1, y: point.y }, 1,
                    reglabel , zeroEmbeddedImage, labelMap);
                regions[reglabel-1].addInnerContour(cnt);
            } else if(isRegionPixel(labelMap, zeroEmbeddedImage, point)){
                const reglabel = labelMap.get(point.y, point.x - 1);
                labelMap.set(point.y, point.x, reglabel);

                regions[reglabel-1].addRegionPixel(point);
            }
            
          
        }
    }

    return [regions, labelMap];
};


/**
 * Creates the label map and a zero embedded image
 * Zero embedded image is used to simplify contour tracing
 * and eliminates the need to handle number of special situations
 * @param {ndarray<number>} image - input image
 */
const createLabelMap = (image: ndarray<number>): [ndarray<number>, ndarray<number>] => {
    const [rows, cols] = image.shape;
    const zeroEmbeddedImage = pool.zeros([rows+2, cols+2],'uint8');
    for(let r = 1; r < zeroEmbeddedImage.shape[0]; r++)
        for(let c = 1; c < zeroEmbeddedImage.shape[1]; c++)
            zeroEmbeddedImage.set(r,c, image.get(r - 1, c - 1));
    
    const labelMap = pool.zeros(zeroEmbeddedImage.shape, 'int16');
    return [labelMap, zeroEmbeddedImage];
};


const isOuterContour = (labelMap: ndarray<number>, zeroEmbeddedImage:ndarray<number>, point: Point): boolean =>
    zeroEmbeddedImage.get(point.y, point.x) === FOREGROUND &&
    zeroEmbeddedImage.get(point.y , point.x - 1) === BACKGROUND &&
    labelMap.get(point.y , point. x) === 0;


const isInnerContour = (labelMap: ndarray<number>, zeroEmbeddedImage:ndarray<number>, point: Point): boolean =>
    zeroEmbeddedImage.get(point.y, point.x) === BACKGROUND &&
    zeroEmbeddedImage.get(point.y, point.x - 1) === FOREGROUND &&
    labelMap.get(point.y, point.x) !== -1;


const isRegionPixel = (labelMap: ndarray<number>, zeroEmbeddedImage:ndarray<number>, point: Point): boolean =>
    zeroEmbeddedImage.get(point.y, point.x) === FOREGROUND &&
    zeroEmbeddedImage.get(point.y, point.x - 1) === FOREGROUND &&
    labelMap.get(point.y, point.x) === 0;