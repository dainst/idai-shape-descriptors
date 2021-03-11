import pack = require('ndarray-pack');
import { BinaryRegion } from '../../../image_processing/blob_analysis/binary_region';
import { Point } from '../../../image_processing/blob_analysis/point';
import { regionLabeling } from '../../../image_processing/blob_analysis/region_labeling';

const binaryImage = pack([
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],//1
    [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],//2
    [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],//3
    [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],//4
    [0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],//5
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],//6
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0],//7
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0],//8
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0],//9
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//10
]);

describe('Test regionLabeling', () => {

    let regions: BinaryRegion[] = [];

    beforeAll(() => {
       // eslint-disable-next-line @typescript-eslint/no-unused-vars
       const [regs, labelMap] = regionLabeling(binaryImage);
       regions = regs;
    });

    it('Should have found 3 regions', () => {
        expect(regions.length).toBe(3);
    });

    it('Should have found the region with inner and outer contour first', () => {
        expect(regions[0].getOuterContour().points.length).toBe(28);
        expect(regions[0].getInnerContours().length).toBe(1);
        expect(regions[0].getInnerContours()[0].points.length).toBe(10);
    });

    it('Should have found point (x:18 y: 8) as start point for outer contour of third region', () => {
        const expected_point: Point = { x: 18 + 1, y: 8 - 1 }; //keep zero embbed in mind. Therefore + 1
        const [last_point] = regions[2].getOuterContour().points.slice(-1);
        expect(last_point).toEqual(expected_point);
    });

    it('Should detect region 3 with region size 9', () => {
        const expected_size = 9;
        expect(regions[2].getRegionPixels().length).toBe(expected_size);
    });
});