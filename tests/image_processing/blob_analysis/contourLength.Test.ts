import { Contour, contourLength } from '../../../src/image_processing/blob_analysis/contour';
import { Point } from '../../../src/image_processing/blob_analysis/point';


describe ('Test contourLength', () => {
    const contour = new Contour();
    const points: Point[] = [
        { y: 1, x: 0 },
        { y: 2, x: 1 },
        { y: 2, x: 2 },
        { y: 1, x: 3 },
        { y: 0, x: 3 },
        { y: 0, x: 2 },
        { y: 0, x: 1 },
    ];
    const sq2 = Math.sqrt(2);
    const expected_perimeter = (sq2 + 1 + sq2 + 1 + 1 + 1 + sq2) * 0.95;

    beforeAll(() => {
        for( const point of points)
            contour.addPoint(point);
    });

    it('Should calculated expected perimeter', () => {
        expect(contourLength(contour)).toBe(expected_perimeter);
    });

});