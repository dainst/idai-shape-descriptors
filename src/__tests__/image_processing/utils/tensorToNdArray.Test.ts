import * as tf from '@tensorflow/tfjs';
import { tensorToBinaryImage } from '../../../image_processing/utils/utils';

const createRandomBinaryImage = (rows: number, columns: number): number[][] => {
    const image = [];
    for(let r = 0; r < rows; r++){
        const row = [];
        for(let c = 0; c < columns; c++){
            row.push(Math.random() < 0.5 ? 0 : 1);
        }
        image.push(row);
    }
    return image;
};

describe('tensorToBinaryImage', () => {

    let classImage: tf.Tensor;
    let randBinaryImage: number[][];

    beforeAll(() => {

        const [rows, cols] = [30, 50];
        randBinaryImage = createRandomBinaryImage(rows, cols);
        classImage = tf.tensor(randBinaryImage);

    });

    it('Should return same image data', () => {
        const res = tensorToBinaryImage(classImage);

        const res_flat = res.data;
        const randBinaryImage_flat = randBinaryImage.reduce((acc, val) => acc.concat(val), []);
        expect(res_flat.length).toBe(randBinaryImage_flat.length);
        for(let i = 0; i < res_flat.length; i++)
            expect(res_flat[i]).toBe(randBinaryImage_flat[i]);
    });
});