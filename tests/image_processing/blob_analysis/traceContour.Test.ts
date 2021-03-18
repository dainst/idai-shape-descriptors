/* eslint-disable no-multi-spaces */
import { Point } from '../../../src/image_processing/blob_analysis/point';
import { Contour } from '../../../src/image_processing/blob_analysis/contour';
import { traceContour } from '../../../src/image_processing/blob_analysis/contour_tracer';
import * as tf from '@tensorflow/tfjs';
import { getEntryFromTensor2D, setEntryOfTensor2D } from '../../../src/image_processing/utils/utils';


const outerContourImage = tf.tensor2d([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//0
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],//1
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],//2
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],//3
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],//4
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],//5
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],//6
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],]//7
);

const expectedOuterContourLabelMap = tf.tensor2d([
    [0, 0, 0,  0, -1, -1, -1, -1, -1,  0,  0,  0],//0
    [0, 0, 0, -1, -1,  2,  2,  2, -1, -1, -1, -1],//1
    [0, 0, 0, -1,  2,  0,  0,  0,  2,  2,  2, -1],//2
    [0, 0, 0, -1, -1,  2,  0,  0,  0,  0,  2, -1],//3
    [0, 0, 0,  0, -1,  2,  0,  0,  0,  2, -1, -1],//4
    [0, 0, 0,  0, -1,  2,  0,  0,  2,  2, -1,  0],//5
    [0, 0, 0,  0, -1, -1,  2,  2, -1, -1, -1,  0],//6
    [0, 0, 0,  0,  0, -1, -1, -1, -1,  0,  0,  0],]//7
);

const outerCntStartPoint: Point = { x: 5, y: 1 };
const outerContourArray: Point[] = [
    { y: 1, x: 6 },//1
    { y: 1, x: 7 },//2
    { y: 2, x: 8 },//3
    { y: 2, x: 9 },//4
    { y: 2, x: 10 },//5
    { y: 3, x: 10 },//6
    { y: 4, x: 9 },//7
    { y: 5, x: 9 },//8
    { y: 5, x: 8 },//9
    { y: 6, x: 7 },//10
    { y: 6, x: 6 },//11
    { y: 5, x: 5 },//12
    { y: 4, x: 5 },//13
    { y: 3, x: 5 },//14
    { y: 2, x: 4 },//15
    { y: 1, x: 5 },//16
];

const innerContourImage = tf.tensor2d([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//0
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],//1
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],//2
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],//3
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],//4
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],//5
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],//6
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],//7
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],//8
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],//9
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//10
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//11
]);

const expectedInnerContourLabelMap: Point[] = [
    { x: 6, y: 5 },
    { x: 6, y: 6 },
    { x: 7, y: 7 },
    { x: 8, y: 7 },
    { x: 9, y: 6 },
    { x: 9, y: 5 },
    { x: 9, y: 4 },
    { x: 8, y: 3 },
    { x: 7, y: 3 },
    { x: 6, y: 4 }
  ];
const innerCntStartPoint: Point = { x: 6, y: 4 };

describe('Test traceContour function', () => {

    const label = 2;

    let outerCnt: Contour;
    const outerCntLabelMap = tf.zeros(outerContourImage.shape) as tf.Tensor2D;
    setEntryOfTensor2D(outerCntLabelMap,{ y: 1, x: 4 }, label);

    let innerCnt: Contour;
    const innerCntLabelMap = tf.zeros(innerContourImage.shape) as tf.Tensor2D;
    

    beforeAll(() => {
        outerCnt = traceContour(outerCntStartPoint,0,label, outerContourImage, outerCntLabelMap);
        innerCnt = traceContour(innerCntStartPoint, 1, label, innerContourImage, innerCntLabelMap);
    });

    it('Should find outer contour', () => {
        expect(outerCnt.points).toEqual(outerContourArray);
    });

    it('Should mark all outer contour pixel with label value', () => {
        for(const point of outerContourArray)
            expect(getEntryFromTensor2D(outerCntLabelMap, point.y, point.x)).toBe(label);
    });

    it('Should mark labelMap as expected', () => {
        expect(outerCntLabelMap.toString()).toEqual(expectedOuterContourLabelMap.toString());
    });

    it('Should detect inner contour', () => {
        expect(innerCnt.points).toEqual(expectedInnerContourLabelMap);
    });
});