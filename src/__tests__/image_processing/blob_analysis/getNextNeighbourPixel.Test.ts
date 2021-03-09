import rewire from 'rewire';

describe('Test getNextNeighbourPixel function',() => {

    const api = rewire('../../../../lib/image_processing/blob_analysis/contour_tracer');
    const getNextNeighbourPixel = api.__get__('getNextNeighbourPixel');

    it('Should return correct neighbour pixel for search direction 0', () => {
        const point = getNextNeighbourPixel(0);
        expect(point).toEqual({ x: 1, y: 0 });
    });
    
    it('Should return correct neighbour pixel for search direction 1', () => {
        const point = getNextNeighbourPixel(1);
        expect(point).toEqual({ x: 1, y: 1 });
    });
    
    it('Should return correct neighbour pixel for search direction 2', () => {
        const point = getNextNeighbourPixel(2);
        expect(point).toEqual({ x: 0, y: 1 });
    });
    
    it('Should return correct neighbour pixel for search direction 3', () => {
        const point = getNextNeighbourPixel(3);
        expect(point).toEqual({ x: -1, y: 1 });
    });
    
    it('Should return correct neighbour pixel for search direction 4', () => {
        const point = getNextNeighbourPixel(4);
        expect(point).toEqual({ x: -1, y: 0 });
    });
    
    it('Should return correct neighbour pixel for search direction 5', () => {
        const point = getNextNeighbourPixel(5);
        expect(point).toEqual({ x: -1, y: -1 });
    });
    
    it('Should return correct neighbour pixel for search direction 6', () => {
        const point = getNextNeighbourPixel(6);
        expect(point).toEqual({ x: 0, y: -1 });
    });
    
    it('Should return correct neighbour pixel for search direction 7', () => {
        const point = getNextNeighbourPixel(7);
        expect(point).toEqual({ x: 1, y: -1 });
    });
});
