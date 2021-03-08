import { Contour } from '../../../image_processing/blob_analysis/contour';

let contour: Contour;

beforeEach(() => {
    contour = new Contour();
});

test('Should have empty points array when initiated', () => {
    expect(Array.isArray(contour.points)).toBe(true);
});

test('Should store added contour points', () => {
    const control_array = [];
    for(let i=0; i < 5; i++){
        control_array.push({ row: i, col: i });
        contour.addPoint({ row: i, col: i });
    }
    expect(contour.points).toEqual(control_array);
});