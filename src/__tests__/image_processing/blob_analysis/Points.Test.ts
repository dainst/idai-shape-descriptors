import { Point, addPoints } from '../../../image_processing/blob_analysis/point';

test('Should add points with addPoints', () => {
    const p1: Point = { row: 2, col: 4 };
    const p2: Point = { row: 5, col: 8 };
    expect(addPoints(p1,p2)).toEqual({ row: 7, col: 12 });
});