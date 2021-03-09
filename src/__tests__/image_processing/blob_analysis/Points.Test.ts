import { Point, addPoints, isEqualPoints } from '../../../image_processing/blob_analysis/point';

test('Should add points with addPoints', () => {
    const p1: Point = { x: 2, y: 4 };
    const p2: Point = { x: 5, y: 8 };
    const expected_out: Point = { x: 7, y: 12 };
    expect(addPoints(p1,p2)).toEqual(expected_out);
});


test('Should be able to compare to Points at different memory locations', () => {
    const p1: Point = { x: 2, y: 4 };
    const p2: Point = { x: 5, y: 8 };
    const p3: Point = { y: 8, x: 5 };
    expect( isEqualPoints(p1,p2)).toBe(false);
    expect( isEqualPoints(p2,p3)).toBe(true);
});