import { Point } from '../point';

export class Parallelogram implements IShape {

    constructor(private _screen: CanvasRenderingContext2D,
                public point1: Point,
                public point2: Point,
                public point3: Point) {
    }

    draw() {
        const point4 = {
            x: this.point1.x - this.point2.x + this.point3.x,
            y: this.point1.y - this.point2.y + this.point3.y
        };

        this._screen.beginPath();
        this._screen.strokeStyle = '#00f';
        this._screen.moveTo(this.point1.x, this.point1.y);
        this._screen.lineTo(this.point2.x, this.point2.y);
        this._screen.lineTo(this.point3.x, this.point3.y);
        this._screen.lineTo(point4.x, point4.y);
        this._screen.lineTo(this.point1.x, this.point1.y);
        this._screen.stroke();
    }
}