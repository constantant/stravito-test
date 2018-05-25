export class AppView {
    canvas: HTMLCanvasElement;
    screen: CanvasRenderingContext2D;

    private _rootElement = document.createElement('div');
    private _canvasContainer: HTMLDivElement;
    private _button: HTMLButtonElement;
    private _delta: IPoint = { x: 0, y: 0 };

    constructor() {
        this._rootElement.className = 'app-root';
        this._rootElement.innerHTML = `<div class="app-canvas"></div><button class="app-button-clean">Clean</button>`;
        this._canvasContainer = this._rootElement.querySelector('.app-canvas');
        this._button = this._rootElement.querySelector('.app-button-clean');
        this.canvas = document.createElement('canvas');
        this.screen = this.canvas.getContext('2d');
        this._canvasContainer.appendChild(this.canvas);

        this._updateDelta();
        window.addEventListener('resize', () => this._updateDelta());

        const dispatchWindowEvent = (touches: TouchList, type: string) => {
            if (type === 'mouseup') {
                window.dispatchEvent(new MouseEvent(type));
                return;
            }
            Array.prototype.forEach.call(touches, (touch: Touch) => {
                const mouseEvent = new MouseEvent(type, {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                window.dispatchEvent(mouseEvent);
            });
        };
        window.addEventListener(
            'touchstart', (event: TouchEvent) => dispatchWindowEvent(event.touches, 'mousedown'));
        window.addEventListener(
            'touchend', (event: TouchEvent) => dispatchWindowEvent(event.touches, 'mouseup'));
        window.addEventListener(
            'touchcancel', (event: TouchEvent) => dispatchWindowEvent(event.touches, 'mouseup'));
        window.addEventListener(
            'touchmove', (event: TouchEvent) => dispatchWindowEvent(event.touches, 'mousemove'));
    }

    render(parent?: HTMLElement) {
        (parent || document.body).appendChild(this._rootElement);
    }

    showButton() {
        this._button.style.display = '';
    }

    hideButton() {
        this._button.style.display = 'none';
    }

    setCleanListener(fn: () => void) {
        this._button.addEventListener('click', (event: MouseEvent) => {
            event.stopPropagation();
            fn()
        });
    }

    setMouseListener(type: string, fn: (point: IPoint) => void) {
        window.addEventListener(type, (event: MouseEvent) => fn(this._getPointByMouseEvent(event)));
    }

    clearRect() {
        this.screen.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private _getPointByMouseEvent(event: MouseEvent) {
        const { clientX, clientY } = event;
        const x = clientX - this._delta.x;
        const y = clientY - this._delta.y;
        return { x, y };
    }

    private _updateDelta() {
        setTimeout(() => {
            const { width, height, top, left } = this._canvasContainer.getBoundingClientRect();
            this._delta = { x: left, y: top };
            this.canvas.width = width;
            this.canvas.height = height;
        });
    }
}