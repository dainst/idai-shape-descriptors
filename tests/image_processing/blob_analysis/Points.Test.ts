import {
    Point,
    addPoints,
    arePointsEqual,
    toArray,
    subtractPoints } from '../../../src/image_processing/blob_analysis/point';

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
    expect( arePointsEqual(p1,p2)).toBe(false);
    expect( arePointsEqual(p2,p3)).toBe(true);
});


test('Should convert Point to array', () => {
    const [x ,y] = [Math.floor(Math.random() * 40), Math.floor(Math.random() * 100)];
    const p1: Point = { x, y };
    const expected_out = [x, y];
    expect(toArray(p1)).toEqual(expected_out);
});


test('Should be able to subtract points', () => {
    const [x1 ,y1] = [Math.floor(Math.random() * 40), Math.floor(Math.random() * 100)];
    const [x2 ,y2] = [Math.floor(Math.random() * 40), Math.floor(Math.random() * 100)];
    const p1: Point = { x: x1, y: y1 };
    const p2: Point = { x: x2, y: y2 };
    const expected_point: Point = { x: x1 - x2, y: y1 - y2 };
    expect(subtractPoints(p1,p2)).toEqual(expected_point);
});