import { BinaryRegion } from '../../../image_processing/blob_analysis/binary_region';
import { Contour } from '../../../image_processing/blob_analysis/contour';


const label = 3;
let region: BinaryRegion;
let contour: Contour;
const contour_length = 5;

beforeAll(() => {
    region = new BinaryRegion(label);
    contour = new Contour();
    
    for(let i=0; i < contour_length; i++)
        contour.addPoint({ x: i,y: i });
});

test('Should be initiated with label.', () => {
    expect(region.getLabel()).toBe(3);
});

test('Should have empty innerContours array when created', () => {
    expect(region.getInnerContours().length).toBe(0);
});

test('Should be able to set outer contour', () => {
    

    region.setOuterContour(contour);
    expect(region.getOuterContour()).toEqual(contour);
});

test('Should be able to add inner contour', () => {
    region.addInnerContour(contour);
    expect(region.getInnerContours().length).toBe(1);
    expect(region.getInnerContours()[0]).toEqual(contour);
});

test('Should append one pixel to outer Contour when using addOuterContourPixel', () => {
    const expected_cnt = [...contour.points];
    expected_cnt.push({ x: 8,y: 8 });
    region.addOuterContourPixel({ x: 8,y: 8 });
    expect(region.getOuterContour().points).toEqual(expected_cnt);
});

test('Should append one pixel to latest pushed Innercontour when calling addInnerContourPixel',() => {
    const second_contour = new Contour();
    for(let i=0; i < 10; i++){
        const randInt = Math.floor( Math.random()*10);
        second_contour.addPoint({ x: randInt, y: randInt });
    }
    const expected_cnt = [...second_contour.points];
    expected_cnt.push({ x: 8,y: 8 });

    region.addInnerContour(second_contour);
    region.addInnerContourPixel({ x: 8,y: 8 });

    expect(region.getInnerContours().length).toBe(2);
    expect(region.getInnerContours()[1].points).toEqual(expected_cnt);

});
