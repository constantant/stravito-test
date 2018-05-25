import { Point } from '../point';
import { Circle } from '../circle';

export class AppInfo implements IShape {
    private _points: Point[] = [];
    private _circle: Circle;
    private _hint: string[] = [];
    private _authorPhoto: HTMLImageElement;

    constructor(private _screen: CanvasRenderingContext2D,
                private _author: IAuthor) {
        this._authorPhoto = new Image();
        this._authorPhoto.src = this._author.photo;
    }

    draw() {
        this._drawAuthor();
        this._drawInstruction();
        this._drawParameters();
    }

    addPoint(point: Point) {
        this._points.push(point);
    }

    setCircle(circle: Circle) {
        this._circle = circle;
    }

    setHint(hint?: string[]) {
        this._hint = hint;
    }

    private _drawAuthor() {
        const { lastName, firstName } = this._author;
        this._screen.font = '14px Arial';
        this._screen.fillStyle = '#1b1b1b';
        this._screen.drawImage(this._authorPhoto, 10, 10, 70, 70);
        this._screen.fillText('Author', 90, 36);
        this._screen.fillText(`${firstName} ${lastName}`, 90, 56);
    }

    private _drawInstruction() {
        this._screen.font = '12px Arial';
        this._screen.fillStyle = '#1b1b1b';
        this._screen.fillText('Follow the instruction:', 10, 110);

        this._screen.font = '14px Arial';
        this._hint.forEach((hint: string, index: number) => {
            this._screen.fillText(`${hint}`, 10, 130 + index * 20);
        });
    }

    private _drawParameters() {
        if (this._circle) {
            this._screen.font = '12px Arial';
            this._screen.fillStyle = '#00f';
            this._screen.fillText(`Area: ${this._circle.area}`, this._circle.center.x - 20, this._circle.center.y);
        }

        this._screen.font = '10px Arial';
        this._screen.fillStyle = '#f00';
        this._points.forEach((point: Point) => {
            const { x, y } = point;
            this._screen.fillText(`x: ${x}, y: ${y}`, x + 12, y - 12);
        });
    }
}