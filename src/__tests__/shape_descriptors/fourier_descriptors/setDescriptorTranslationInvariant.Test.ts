import * as tf from '@tensorflow/tfjs';
import { setDescriptorTranslationInvariant } from
    '../../../shape_descriptors/fourier_descriptors/fourier_descriptors_phase';

describe('Test setDescriptorTranslationInvariant', () => {

    it('Should set 0 component of descriptor array to zero', () => {
        const inputTensor = tf.complex([1, 2, 3, 4],[9, 10, 11, 12]);
        const expectedTensor = tf.complex([0, 2, 3, 4],[0, 10, 11, 12]);
        const transInvariantFD = setDescriptorTranslationInvariant(inputTensor);

        expect(transInvariantFD.toString()).toEqual(expectedTensor.toString());
    });

});