import pool = require('ndarray-scratch');
import pack = require('ndarray-pack');
import rewire from 'rewire';
import ndarray = require('ndarray');
import { isImageBlack } from '../../../image_processing/utils/utils';

const image = pack([
    [0, 1, 1, 0],
    [1, 0, 1, 0],
    [1, 1, 1, 1],
    [0, 1, 1, 0],
]);

describe('Test createLabelMap', () => {

    const api = rewire('../../../../lib/image_processing/blob_analysis/region_labeling');
    const createLabelMap = api.__get__('createLabelMap');
    let labelMap: ndarray<number>;
    let zeroEmbeddedImage: ndarray<number>;

    beforeAll(() => {
        const [lM, zEi] = createLabelMap(image);
        labelMap = lM;
        zeroEmbeddedImage = zEi;
    });

    it('Should output labelMap and zeroEmbedded image with 2 more row and two more columns', () => {
        const [ rows, cols ] = image.shape;
        expect(labelMap.shape).toEqual([rows + 2, cols +2]);
        expect(labelMap.shape).toEqual(zeroEmbeddedImage.shape);
    });

    it('Should return zero embedded image with same image', () => {
        const [rows, cols] = zeroEmbeddedImage.shape;
        for(let r=1; r < rows-1; r++)
            for(let c=1; c < cols-1; c++)
                expect(zeroEmbeddedImage.get(r,c)).toEqual(image.get(r-1, c-1));

        for(let r = 0; r < rows; r++)
            expect(zeroEmbeddedImage.get(r,0)).toBe(0);
    });

    it('Should return a zero valued labelMap', () => {
        expect(isImageBlack(labelMap)).toBe(true);
    });
});