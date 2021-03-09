import { Point, addPoints } from '../../../image_processing/blob_analysis/point';

test('Should add points with addPoints', () => {
    const p1: Point = { x: 2, y: 4 };
    const p2: Point = { x: 5, y: 8 };
    const expected_out: Point = { x: 7, y: 12 };
    expect(addPoints(p1,p2)).toEqual(expected_out);
});