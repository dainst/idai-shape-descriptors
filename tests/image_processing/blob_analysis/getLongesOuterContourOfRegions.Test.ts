import { BinaryRegion } from '../../../src/image_processing/blob_analysis/binary_region';
import { Contour } from '../../../src/image_processing/blob_analysis/contour';
import { Point } from '../../../src/image_processing/blob_analysis/point';
import { getLongesOuterContourOfRegions } from '../../../src/image_processing/blob_analysis/contour';


describe('Test getLongesOuterContourOfRegions', () => {

    it('Should return region with longest outline contour', () => {
        const longestCnt = getLongesOuterContourOfRegions(regions);
        expect(longestCnt).toEqual(cnt2);
    });
});

const cnt1P = [
    { y:2, x:2 },
    { y:2, x:3 },
    { y:3, x:4 },
    { y:4, x:4 },
    { y:5, x:3 },
    { y:5, x:2 },
    { y:4, x:1 },
    { y:4, x:1 }
];

const cnt2P = [
    { y: 1, x: 6 },
    { y: 1, x: 7 },
    { y: 2, x: 8 },
    { y: 2, x: 9 },
    { y: 2, x: 10 },
    { y: 3, x: 10 },
    { y: 4, x: 9 },
    { y: 5, x: 9 },
    { y: 5, x: 8 },
    { y: 6, x: 7 },
    { y: 6, x: 6 },
    { y: 5, x: 5 },
    { y: 4, x: 5 },
    { y: 3, x: 5 },
    { y: 2, x: 4 },
    { y: 1, x: 5 },
];

const cnt3P = [
    { y:7, x:18 },
    { y:7, x:19 },
    { y:7, x:20 },
    { y:8, x:20 },
    { y:9, x:20 },
    { y:9, x:19 },
    { y:9, x:18 },
    { y:8, x:18 },
];

const createContourWithPoints = (points: Point[]): Contour => {
    const cnt = new Contour();
    for(const point of points) cnt.addPoint(point);
    return cnt;
};

const cnt1 = createContourWithPoints(cnt1P);
const cnt2 = createContourWithPoints(cnt2P);
const cnt3 = createContourWithPoints(cnt3P);
const regions = [cnt1, cnt2, cnt3].map((cnt, i) => {
    const region = new BinaryRegion(i);
    region.setOuterContour(cnt);
    return region;
});