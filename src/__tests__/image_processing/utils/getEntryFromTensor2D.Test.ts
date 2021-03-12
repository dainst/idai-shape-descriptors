import { getEntryFromTensor2D } from '../../../image_processing/utils/utils';
import * as tf from '@tensorflow/tfjs';

describe('getEntryFromTensor2D', () => {
    
    const image = [
        [1, 2, 3],
        [2, 3, 4],
        [5, 6, 7]];
    const [row, col] = [1, 1];
    const tensor = tf.tensor2d(image);
    const expected_value = 3;

    it('Should return expected entry from 2D array', () => {
     
        expect(getEntryFromTensor2D(tensor, row, col)).toBe(expected_value);
    });
});