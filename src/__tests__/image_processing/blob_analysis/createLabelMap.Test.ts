import rewire from 'rewire';
import { getEntryFromTensor2D, isImageBlack } from '../../../image_processing/utils/utils';
import * as tf from '@tensorflow/tfjs';

const image = tf.tensor2d([
    [0, 1, 1, 0],
    [1, 0, 1, 0],
    [1, 1, 1, 1],
    [0, 1, 1, 0],
]);

describe('Test createLabelMap', () => {

    const api = rewire('../../../../lib/image_processing/blob_analysis/region_labeling');
    const createLabelMap = api.__get__('createLabelMap');
    let labelMap: tf.Tensor2D;
    let zeroEmbeddedImage: tf.Tensor2D;

    beforeAll(() => {
        const [lM, zEi] = createLabelMap(image);
        labelMap = lM;
        zeroEmbeddedImage = zEi;
    });

    it('Should output labelMap and zeroEmbedded image with 2 more row and two more columns', () => {
        const [ rows, cols ] = image.shape;
        expect(labelMap.shape).toEqual([rows + 2, cols + 2]);
        expect(labelMap.shape).toEqual(zeroEmbeddedImage.shape);
    });

    it('Should return zero embedded image with same image', () => {
        const [rows, cols] = zeroEmbeddedImage.shape;
        for(let r = 1; r < rows - 1; r++)
            for(let c = 1; c < cols - 1; c++)
                expect(getEntryFromTensor2D(zeroEmbeddedImage, r, c))
                    .toEqual(getEntryFromTensor2D(image, r - 1, c - 1));

        for(let r = 0; r < rows; r++)
            expect(getEntryFromTensor2D(zeroEmbeddedImage, r, 0)).toBe(0);
    });

    it('Should return a zero valued labelMap', () => {
        expect(isImageBlack(labelMap)).toBe(true);
    });
});