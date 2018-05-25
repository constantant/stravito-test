import { Circle } from './circle';
import { Parallelogram } from './parallelogram';
import { Point } from './point';
import { AppView } from './app-view';
import { AppInfo } from './app-info';

enum EMouseState {
    Down,
    Up
}

export class App {
    private _shapes: IShape[];
    private _pointCount = 0;
    private _mouseState: EMouseState = EMouseState.Up;
    private _pointToMove: Point;
    private _appView: AppView;
    private _appInfo: AppInfo;

    static hints: { [ key: string ]: string[] } = {
        'step1': [
            'Put three points on the free area'
        ],
        'step2': [
            'Move the red circles',
            'that allows to change the sizes of',
            'the blue parallelogram and the yellow circle'
        ]
    };

    constructor(private _author: IAuthor) {
        this._makeAppearance();
    }

    clean() {
        this._appView.hideButton();
        this._appInfo = new AppInfo(this._appView.screen, this._author);
        this._setHints('step1');
        this._shapes = [ this._appInfo ];
        this._pointCount = 0;
    }

    run(parent?: HTMLElement) {
        this._appView.render(parent);
        this._setListeners();
        this._tick();
    }

    private _draw() {
        this._appView.clearRect();
        this._shapes.forEach((shape: IShape) => shape.draw());
    }

    private _tick() {
        this._draw();
        requestAnimationFrame(() => this._tick());
    }

    private _onClick(point: IPoint) {
        if (this._pointCount === 3) {
            return;
        }
        const { x, y } = point;
        const { screen } = this._appView;
        const exists = this._shapes.some((shape: IShape) => {
            if (!(shape instanceof Point)) {
                return false;
            }
            return (shape as Point).includes(point);
        });

        if (exists) {
            return;
        }

        const _point = new Point(screen, x, y);
        this._shapes.push(_point);
        this._appInfo.addPoint(_point);

        if (++this._pointCount === 3) {
            const [ point1, point2, point3 ] = (this._shapes.filter((shape: IShape) => shape instanceof Point) as Point[]);
            this._shapes.push(new Parallelogram(screen, point1, point2, point3));

            const circle = new Circle(screen, point1, point2, point3);
            this._shapes.push(circle);
            this._appInfo.setCircle(circle);
            this._setHints('step2');
        }

        if (this._pointCount > 0) {
            this._appView.showButton();
        }
    }

    private _onMouseDown(point: IPoint) {
        this._mouseState = EMouseState.Down;
        const [ _pointToMove ] = this._shapes.filter((shape: IShape) => {
            if (!(shape instanceof Point)) {
                return false;
            }
            return (shape as Point).includes(point);
        });
        this._pointToMove = _pointToMove as Point;
    }

    private _onMouseUp() {
        this._mouseState = EMouseState.Up;
    }

    private _onMouseMove(point: IPoint) {
        if (this._mouseState === EMouseState.Up) {
            return;
        }
        if (!this._pointToMove) {
            return;
        }
        const { x, y } = point;
        this._pointToMove.x = x;
        this._pointToMove.y = y;
    }

    private _setListeners() {
        this._appView.setCleanListener(() => this.clean());
        this._appView.setMouseListener('click', (point: IPoint) => this._onClick(point));
        this._appView.setMouseListener('mousedown', (point: IPoint) => this._onMouseDown(point));
        this._appView.setMouseListener('mouseup', () => this._onMouseUp());
        this._appView.setMouseListener('mousemove', (point: IPoint) => this._onMouseMove(point));
    }

    private _setHints(stepName: string) {
        this._appInfo.setHint(App.hints[ stepName ]);
    }

    private _makeAppearance() {
        this._appView = new AppView();
        this._appInfo = new AppInfo(this._appView.screen, this._author);
        this._setHints('step1');
        this._shapes = [ this._appInfo ];
        this._appView.hideButton();
        this._appView.render();
    }
}