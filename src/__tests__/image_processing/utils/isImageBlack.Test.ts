import { isImageBlack } from '../../../image_processing/utils/utils';
import * as tf from '@tensorflow/tfjs';


test('isImageBlack false for non black image', () => {

    const image = tf.tensor2d([1, 0, 0, 1], [2,2]);
    expect(isImageBlack( image)).toBe(false);
});

test('isImageBlack true for black image', () => {
    expect(isImageBlack( tf.zeros([5,5]) )).toBe(true);
});
