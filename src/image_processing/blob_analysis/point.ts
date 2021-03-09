export interface Point {
    x: number;
    y: number;
}

export const addPoints = (p1: Point, p2: Point): Point => {

    return { x: p1.x + p2.x, y: p1.y + p2.y };
};

export const isEqualPoints = (p1: Point, p2: Point): boolean =>
    Object.entries(p1).toString() === Object.entries(p2).toString();