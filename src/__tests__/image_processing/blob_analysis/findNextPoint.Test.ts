import rewire from 'rewire';
import pack = require('ndarray-pack');
import pool = require('ndarray-scratch');
import { Point } from '../../../image_processing/blob_analysis/point';

describe('Test function findNextPoint', ()=> {
    const api = rewire('../../../../lib/image_processing/blob_analysis/contour_tracer');
    const findNextPoint = api.__get__('findNextPoint');
    
    it('Should return start pixel if no neighbour pixel is found', () => {
        const noNeighoursImage = pool.zeros([3,3]);
        const startPoint: Point = { x: 1, y: 1 };
        const labelMap = pool.zeros([3,3]);

        const [foundPoint, direction] = findNextPoint(startPoint, 0, noNeighoursImage, labelMap);
        expect(foundPoint).toEqual(startPoint);
        expect(0).toEqual(direction);
    });

    it('Should set labelMap neighbour pixel with value BACKGROUND to -1', () => {
        const binaryImage = pack([[1,1,0],
                                [0,1,0],
                                [1,0,0]]);
        const startPoint: Point = { x: 1, y: 1 };
        const labelMap = pack([ [1,1,0],
                                [0,1,0],
                                [0,0,0]]);
        const expected_labelMap = pack([[1,1,-1],
                                        [0,1,-1],
                                        [0,-1,-1]]);
        const expected_point: Point = { x: 0 ,y: 2 };
        const searchDir = 7;
  
        const [foundPoint, direction] = findNextPoint(startPoint, searchDir, binaryImage, labelMap);
        
        expect(foundPoint).toEqual(expected_point);
        expect(direction).toEqual(3);
        expect(labelMap).toEqual(expected_labelMap);
    });

    it('Should find neighbour pixel to the right', () => {
        const binaryImage = pack([ [1,0,0],
                                    [0,1,1],
                                    [1,0,0]]);
        const searchDir = 6;
        const expected_point = { x:2, y: 1 };
        const startPoint: Point = { x: 1, y: 1 };
        const labelMap = pack([ [1,0,0],
            [0,1,1],
            [1,0,0]]);
        const [foundPoint, direction] = findNextPoint(startPoint, searchDir, binaryImage, labelMap);
        expect(direction).toEqual(0);
        expect(foundPoint).toEqual(expected_point);
    });
});