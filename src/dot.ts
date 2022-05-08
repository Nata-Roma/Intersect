import Control from './control';
import { calcAngle, IDotParams } from './index';

export const signes = {
    positive: 1,
    negative: -1,
};

export class Dot extends Control {
    protected x: number = 0;
    protected y: number = 0;
    protected angle: number;
    protected signX: number;
    protected signY: number;
    protected flag = false;
    protected observer: IntersectionObserver;
    public intersection: (x: number, y: number, border: string) => void;
    id: number;

    constructor(parentNode: HTMLElement, params: IDotParams) {
        super(parentNode, 'div', 'dot');
        this.x = params.left;
        this.y = params.top;
        this.angle = params.angle;

        this.observer = null;
        this.setDotStyles(params);
        this.createObserver(parentNode);
    }

    setFlag(state: boolean) {
        this.flag = state;
    }

    getFlag() {
        return this.flag;
    }

    handleIntersect(entries: Array<IntersectionObserverEntry>, observer: IntersectionObserver) {
        entries.forEach((entry) => {
            if (!(entry.intersectionRatio > 0)) {
                const { x, y, border } = this.detectOutputParams(entry);
                this.intersection(x, y, border);
            }
        });
    }

    detectOutputParams(entry: IntersectionObserverEntry) {
        const {
            left: dotLeft,
            right: dotRight,
            top: dotTop,
            bottom: dotBottom,
        } = entry.boundingClientRect;
        const { left, right, top, bottom } = entry.rootBounds;

        const checkLeft = Math.abs(Math.floor(dotRight - left));
        const checkRight = Math.abs(Math.floor(dotLeft - right));
        const checkTop = Math.abs(Math.floor(dotBottom - top));
        const checkBottom = Math.abs(Math.floor(dotTop - bottom));

        let border = '';

        if (checkBottom <= 2 || checkTop <= 2) {
            this.angle = Math.PI * 2 - this.angle;
            border = checkBottom <= 2 ? 'bottom' : 'top';
        }
        if (checkRight <= 2 || checkLeft <= 2) {
            this.angle = Math.PI - this.angle;
            border = checkRight <= 2 ? 'right' : 'left';
        }

        let x = 0;
        let y = 0;

        if (!Number.isNaN(this.x)) {
            x = this.x + 2;
        } else if (border === 'right') {
            x = entry.rootBounds.width - 13;
        } else if (border === 'left') {
            x = 12;
        } else {
            const newX = entry.boundingClientRect.x + 13;
            x = newX <= entry.rootBounds.width - 13 ? newX : entry.rootBounds.width - 13;
        }

        if (!Number.isNaN(this.y)) {
            y = this.y;
        } else if (border === 'bottom') {
            y = entry.rootBounds.height - 13;
        } else if (border === 'top') {
            y = 12;
        } else {
            const newY = entry.boundingClientRect.y + 13;
            y = newY <= entry.rootBounds.height - 13 ? newY : entry.rootBounds.height - 13;
        }

        return {
            border,
            x,
            y,
        };
    }

    createObserver(parentNode: HTMLElement) {
        const options = {
            root: parentNode,
            rootMargin: '-12px',
            threshold: [0.0],
        };

        this.observer = new IntersectionObserver(
            (entries: Array<IntersectionObserverEntry>, observer: IntersectionObserver) =>
                this.handleIntersect(entries, observer),
            options,
        );
        this.observer.observe(this.node);
    }

    renewPosition() {
        this.flag = false;
    }

    findPosition = (timestamp: number) => {
        this.x = this.x + Math.cos(this.angle);
        if (this.x <= 1) {
            this.angle = calcAngle('left');
        }
        if (this.x >= window.innerWidth - 12) {
            this.angle = calcAngle('right');
        }
        this.y = this.y + Math.sin(this.angle);
        if (this.y >= window.innerHeight - 12) {
            this.angle = calcAngle('bottom');
        }
        if (this.y <= 1) {
            this.angle = calcAngle('top');
        }

        this.setPosition();
    };

    setDotStyles(params: IDotParams) {
        this.setPosition();
        this.node.style.backgroundColor = params.backgroundColor;
        this.node.style.width = `${params.width}px`;
        this.node.style.height = `${params.height}px`;
    }

    setPosition() {
        this.node.style.left = `${this.x}px`;
        this.node.style.top = `${this.y}px`;
    }
}
