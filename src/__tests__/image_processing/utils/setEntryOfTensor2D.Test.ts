import * as tf from '@tensorflow/tfjs';
import { Point } from '../../../image_processing/blob_analysis/point';
import { setEntryOfTensor2D } from '../../../image_processing/utils/utils';

describe('setEntryOfTensor2D', () => {
    const image = [
        [1, 2, 3],
        [2, 3, 4],
        [5, 6, 7]];
    const points: {point: Point, value: number}[] = [
        { point: { y: 1, x: 1 }, value: 5 },
        { point: { y: 0, x: 1 }, value: 90 },
        { point: { y: 2, x: 2 }, value: 123 },
    ];
    const tensor = tf.tensor2d(image);
    const expectedChangedImage = tf.tensor2d(
        [[1, 90, 3],[2, 5, 4], [5, 6, 123]]
    );

    it('Should mutate tensor in correct way', () => {
        for(const point of points)
            setEntryOfTensor2D(tensor, point.point, point.value);
        expect( tensor.toString() ).toEqual(expectedChangedImage.toString());
    });
});