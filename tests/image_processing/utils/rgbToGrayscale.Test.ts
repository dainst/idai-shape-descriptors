import * as tf from '@tensorflow/tfjs';
import { rgbToGrayscale } from '../../../src/image_processing/utils/utils';

describe('Test rgbToGrayscale', () => {
    const [ width, height ] = [12, 12];
    const [r, g, b] = [4, Math.floor(Math.random() * 255), 100];
    
    const image = tf.mul(tf.ones([width,height,3]), tf.scalar(255)) as tf.Tensor3D;
    image.bufferSync().set(r,2,2,0);
    image.bufferSync().set(g,2,2,1);
    image.bufferSync().set(b,2,2,2);
    
    const expectedImage = tf.mul(tf.ones([width, height]),tf.scalar(255));
    expectedImage.bufferSync().set(Math.trunc(r * 0.3 + g * 0.59 + b * 0.11), 2,2);
    
    let grayImage: tf.Tensor2D;

    beforeAll(() => {
        grayImage = rgbToGrayscale(image);
    });

    it('Should be a 2d image with same rows and cols as input image', () => {
        expect(grayImage.shape).toEqual([width, height]);
    });

    it('Should return a white rgb image for input image defined above', () => {
        expect(grayImage.toString()).toEqual(expectedImage.toString());
    });

    it('Should be able to scale the image by scale factor', () => {
        const scaledRGB = rgbToGrayscale(tf.mul(tf.ones([width,height,3]), tf.scalar(255)) as tf.Tensor3D, 255);
        expect(scaledRGB.toString()).toEqual(tf.ones([width, height]).toString());
    });

});