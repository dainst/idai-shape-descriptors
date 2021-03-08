import { Contour } from './contour';
import { Point } from './point';

export class BinaryRegion {

    private outerContour: Contour = new Contour();
    private innerContours: Contour[] = [];
    constructor(
        private readonly label: number,
        
    ) {
        this.label = label;

    }

    addInnerContourPixel = (pixel: Point): void => {
        this.innerContours[this.innerContours.length -1].addPoint(pixel);
    };

    addOuterContourPixel = (pixel: Point): void => {
        this.outerContour.addPoint(pixel);
    };

    setOuterContour = (contour: Contour): void => {
        this.outerContour = contour;
    };

    addInnerContour = (contour: Contour): void => {
        this.innerContours.push(contour);
        
    };

    getLabel = (): number => this.label;
    getInnerContours = (): Contour[] => this.innerContours;
    getOuterContour = (): Contour => this.outerContour;
}