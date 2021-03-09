export interface Point {
    x: number;
    y: number;
}

export const addPoints = (p1: Point, p2: Point): Point => {

    return { x: p1.x + p2.x, y: p1.y + p2.y };
};