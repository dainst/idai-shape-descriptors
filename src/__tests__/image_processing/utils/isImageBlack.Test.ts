import { isImageBlack } from '../../../image_processing/utils/utils';
import ndarray = require('ndarray');
import pool = require('ndarray-scratch');


test('isImageBlack false for non black image', () => {
    expect(isImageBlack( ndarray(new Uint8Array([1, 0, 0, 1]), [2,2]) )).toBe(false);
});

test('isImageBlack true for black image', () => {
    expect(isImageBlack( pool.zeros([5,5]) )).toBe(true);
});
