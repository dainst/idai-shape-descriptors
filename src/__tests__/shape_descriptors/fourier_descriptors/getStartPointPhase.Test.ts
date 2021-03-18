import * as tf from '@tensorflow/tfjs';
import { getStartPointPhase } from '../../../shape_descriptors/fourier_descriptors/fourier_descriptors_phase';

describe('Test getStartPointPhase', () => {
    const expectedValue = 0.023561944901923447;
    const a = Array(81).fill(0).map((x, y) => x + y);
    const descriptor = tf.complex(a, a);
    let startPoint: number;
    const decimals = 5;

    beforeAll(() => {
        startPoint = getStartPointPhase(descriptor);
    });

    it('Should return correct phase of the contour start point', () => {

        expect(startPoint.toFixed(decimals)).toEqual(expectedValue.toFixed(decimals));
    });
});