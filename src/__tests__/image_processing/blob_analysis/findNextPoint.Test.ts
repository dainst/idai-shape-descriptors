import rewire from 'rewire';
import { Point } from '../../../image_processing/blob_analysis/point';
import * as tf from '@tensorflow/tfjs';


describe('Test function findNextPoint', ()=> {
    const api = rewire('../../../../lib/image_processing/blob_analysis/contour_tracer');
    const findNextPoint = api.__get__('findNextPoint');
    
    it('Should return start pixel if no neighbour pixel is found', () => {
        const noNeighoursImage = tf.zeros([3,3]);
        const startPoint: Point = { x: 1, y: 1 };
        const labelMap = tf.zeros([3,3]);

        const [foundPoint, direction] = findNextPoint(startPoint, 0, noNeighoursImage, labelMap);
        expect(foundPoint).toEqual(startPoint);
        expect(0).toEqual(direction);
    });

    it('Should set labelMap neighbour pixel with value BACKGROUND to -1', () => {
        const binaryImage = tf.tensor2d([[1,1,0],
                                [0,1,0],
                                [1,0,0]]);
        const startPoint: Point = { x: 1, y: 1 };
        const labelMap = tf.tensor2d([ [1,1,0],
                                [0,1,0],
                                [0,0,0]]);
        const expected_labelMap = tf.tensor2d([[1,1,-1],
                                        [0,1,-1],
                                        [0,-1,-1]]);
        const expected_point: Point = { x: 0 ,y: 2 };
        const searchDir = 7;
  
        const [foundPoint, direction] = findNextPoint(startPoint, searchDir, binaryImage, labelMap);
        
        expect(foundPoint).toEqual(expected_point);
        expect(direction).toEqual(3);
        expect(labelMap.toString()).toEqual(expected_labelMap.toString());
    });

    it('Should find neighbour pixel to the right', () => {
        const binaryImage = tf.tensor2d([ [1,0,0],
                                    [0,1,1],
                                    [1,0,0]]);
        const searchDir = 6;
        const expected_point = { x:2, y: 1 };
        const startPoint: Point = { x: 1, y: 1 };
        const labelMap = tf.tensor2d([ [1,0,0],
            [0,1,1],
            [1,0,0]]);
        const [foundPoint, direction] = findNextPoint(startPoint, searchDir, binaryImage, labelMap);
        expect(direction).toEqual(0);
        expect(foundPoint).toEqual(expected_point);
    });
});