export interface Point {
    row: number;
    col: number;
}

export const addPoints = (p1: Point, p2: Point): Point => {

    return { row: p1.row + p2.row, col: p1.col + p2.col };
};