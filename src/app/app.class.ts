import { Circle } from './circle';
import { Parallelogram } from './parallelogram';
import { Point } from './point';

enum EMouseState {
    Down,
    Up
}

export class App {
    private _canvas: HTMLCanvasElement;
    private _screen: CanvasRenderingContext2D;
    private _appRootElement: HTMLDivElement;
    private _appCanvasContainer: HTMLElement;
    private _appHeader: HTMLElement;
    private _appButtonClean: HTMLButtonElement;
    private _appHints: HTMLDivElement;
    private _appParams: HTMLDivElement;
    private _appFooter: HTMLElement;
    private _shapes: IShape[] = [];
    private _delta: IPoint;
    private _pointCount = 0;
    private _mouseState: EMouseState = EMouseState.Up;
    private _pointToMove: Point;

    static hints: { [ key: string ]: string } = {
        'step1': 'Put three points on the free area',
        'step2': 'You can move the red circles that allows to change the sizes of the parallelogram and the circle'
    };

    constructor() {
        this._makeAppearance();
    }

    clean() {
        this._shapes = [];
        this._pointCount = 0;
        this._setHints('step1');
        this._appButtonClean.style.display = 'none';
        this._appParams.innerHTML = '';
    }

    run(parent?: HTMLElement) {
        (parent || document.body).appendChild(this._appRootElement);
        setTimeout(() => {
            this._setListeners();
            this._updateCanvasSize();
            this._tick();
        }, 0);
    }

    private _draw() {
        this._screen.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._shapes.forEach((shape: IShape) => shape.draw());
        this._setParams();
    }

    private _tick() {
        this._draw();
        requestAnimationFrame(() => this._tick());
    }

    private _onClick(event: MouseEvent) {
        if (this._pointCount === 3) {
            return;
        }
        const { clientX, clientY } = event;
        const x = clientX - this._delta.x;
        const y = clientY - this._delta.y;
        const exists = this._shapes.some((shape: IShape) => {
            if (!(shape instanceof Point)) {
                return false;
            }
            return (shape as Point).checkPoint({ x, y });
        });

        if (exists) {
            return;
        }

        this._shapes.push(new Point(this._screen, x, y));
        if (++this._pointCount === 3) {
            const [ point1, point2, point3 ] = (this._shapes.filter((shape: IShape) => shape instanceof Point) as Point[]);
            this._shapes.push(new Parallelogram(this._screen, point1, point2, point3));
            this._shapes.push(new Circle(this._screen, point1, point2, point3));
            this._setHints('step2');
            this._appButtonClean.style.display = '';
            this._setParams();
        }
    }

    private _onMouseDown(event: MouseEvent) {
        this._mouseState = EMouseState.Down;
        const { clientY, clientX } = event;
        const x = clientX - this._delta.x;
        const y = clientY - this._delta.y;
        const [ point ] = this._shapes.filter((shape: IShape) => {
            if (!(shape instanceof Point)) {
                return false;
            }
            return (shape as Point).checkPoint({ x, y });
        });
        this._pointToMove = point as Point;
    }

    private _onMouseUp(event: MouseEvent) {
        this._mouseState = EMouseState.Up;
    }

    private _onMouseMove(event: MouseEvent) {
        if (this._mouseState === EMouseState.Up) {
            return;
        }
        if (!this._pointToMove) {
            return;
        }
        const { clientY, clientX } = event;
        const x = clientX - this._delta.x;
        const y = clientY - this._delta.y;
        this._pointToMove.x = x;
        this._pointToMove.y = y;
    }

    private _onWindowResize(event: Event) {
        this._updateCanvasSize();
    }

    private _updateCanvasSize() {
        const { width, height, top, left } = this._appCanvasContainer.getBoundingClientRect();
        this._delta = { x: left, y: top };
        this._canvas.width = width;
        this._canvas.height = height;
    }

    private _setListeners() {
        this._canvas.addEventListener('click', (event: MouseEvent) => this._onClick(event));
        window.addEventListener('mousedown', (event: MouseEvent) => this._onMouseDown(event));
        window.addEventListener('mouseup', (event: MouseEvent) => this._onMouseUp(event));
        window.addEventListener('mousemove', (event: MouseEvent) => this._onMouseMove(event));
        this._appButtonClean.addEventListener('click', (event: MouseEvent) => this.clean());
        window.addEventListener('resize', (event: Event) => this._onWindowResize(event));
    }

    private _setHints(stepName: string) {
        this._appHints.innerHTML = App.hints[ stepName ];
    }

    private _setParams() {
        const points = [];
        let area: number;
        this._shapes.forEach((shape: IShape) => {
            if (shape instanceof Point) {
                points.push([ shape.x, shape.y ]);
            }
            if (shape instanceof Circle) {
                area = shape.area;
            }
        });
        const [ p1, p2, p3 ] = points;
        const str = `p1: ${p1}; p1: ${p2}; p1: ${p3}; S: ${area}`;
        if (p1 && p2 && p3 && area && str !== this._appParams.innerHTML) {
            this._appParams.innerHTML = str;
        }
    }

    private _makeAppearance() {
        this._appRootElement = document.createElement('div');
        this._appRootElement.className = 'app-root';
        this._appRootElement.innerHTML = `<header class="app-header"><div class="app-hints"></div><button class="app-button-clean">Clean</button></header><main class="app-main"><div class="app-canvas"></div></main><footer class="app-footer"><div class="app-params"></div><div>&copy; Konstantin Kharitonov</div></footer>`;

        this._appCanvasContainer = this._appRootElement.querySelector('.app-canvas');
        this._appHeader = this._appRootElement.querySelector('.app-canvas');
        this._appButtonClean = this._appRootElement.querySelector('.app-button-clean');
        this._appHints = this._appRootElement.querySelector('.app-hints');
        this._appParams = this._appRootElement.querySelector('.app-params');
        this._appFooter = this._appRootElement.querySelector('.app-canvas');
        this._canvas = document.createElement('canvas');
        this._screen = this._canvas.getContext('2d');

        this._appCanvasContainer.appendChild(this._canvas);

        this._setHints('step1');
        this._appButtonClean.style.display = 'none';
    }
}