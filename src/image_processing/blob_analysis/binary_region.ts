import { Contour } from './contour';
import { Point } from './point';

export class BinaryRegion {

    private outerContour: Contour = new Contour();
    private innerContours: Contour[] = [];
    private regionPixels: Point[] = [];

    constructor(
        private readonly label: number,
        
    ) {
        this.label = label;

    }

    addInnerContourPixel = (pixel: Point): void => {
        this.innerContours[this.innerContours.length - 1].addPoint(pixel);
        this.regionPixels.push(pixel);
    };

    addOuterContourPixel = (pixel: Point): void => {
        this.outerContour.addPoint(pixel);
        this.regionPixels.push(pixel);
    };

    setOuterContour = (contour: Contour): void => {
        this.outerContour = contour;
        this.regionPixels = this.regionPixels.concat(contour.points);
    };

    addInnerContour = (contour: Contour): void => {
        this.innerContours.push(contour);
        this.regionPixels = this.regionPixels.concat(contour.points);
    };

    addRegionPixel = (pixel: Point): void => {
        this.regionPixels.push(pixel);
    };

    getRegionPixels = (): Point[] => this.regionPixels;
    getLabel = (): number => this.label;
    getInnerContours = (): Contour[] => this.innerContours;
    getOuterContour = (): Contour => this.outerContour;
}