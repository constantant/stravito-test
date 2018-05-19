import { Point } from '../point';

export class Circle implements IShape {
    area: number;

    constructor(private _screen: CanvasRenderingContext2D,
                public point1: Point,
                public point2: Point,
                public point3: Point) {
    }

    draw() {
        const center = {
            x: (this.point1.x + this.point3.x) / 2,
            y: (this.point1.y + this.point3.y) / 2,
        };
        this.area = Math.abs(
            (this.point1.x - this.point3.x) * (this.point2.y - this.point1.y) -
            (this.point1.x - this.point2.x) * (this.point3.y - this.point1.y)
        );
        const radius = Math.sqrt(this.area / Math.PI);

        this._screen.beginPath();
        this._screen.strokeStyle = '#ffde00';
        this._screen.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        this._screen.stroke();
    }
}
