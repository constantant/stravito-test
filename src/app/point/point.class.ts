export class Point implements IShape, IPoint {
    private _radius = 11;

    constructor(private _screen: CanvasRenderingContext2D,
                public x: number,
                public y: number) {
    }

    draw(): void {
        this._screen.beginPath();
        this._screen.strokeStyle = '#f00';
        this._screen.arc(this.x, this.y, this._radius, 0, 2 * Math.PI);
        this._screen.stroke();
    }

    includes(point: IPoint): boolean {
        return Math.abs(point.x - this.x) + Math.abs(point.y - this.y) <= Math.abs(this._radius);
    }
}
