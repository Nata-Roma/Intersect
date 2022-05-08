import '../style.css';

import { Dot } from './dot';
import Control from './control';

export const calcAngle = (border: string) => {
    if (border === 'top') {
        return Math.random() * Math.PI * 0.75;
    }
    if (border === 'bottom') {
        return Math.random() * Math.PI * 0.75 + Math.PI;
    }
    if (border === 'left') {
        return Math.random() < 0.5
            ? Math.random() * (Math.PI / 2)
            : Math.PI * 2 - Math.random() * (Math.PI / 2);
    }
    if (border === 'right') {
        return Math.random() < 0.5
            ? Math.random() * (Math.PI / 2) + Math.PI / 2
            : Math.PI + Math.random() * (Math.PI / 2);
    }
};

export interface IDotParams {
    left: number;
    top: number;
    width: number;
    height: number;
    backgroundColor: string;
    angle: number;
}

class Application extends Control {
    dots: Array<Dot> = [];
    flag: boolean = false;
    count: number = 0;

    constructor(parentNode: HTMLElement) {
        super(parentNode);
        const container = new Control(this.node, 'div', 'container');

        let x = 700 / 2 - 10 / 2;
        let y = 500 / 2 - 10 / 2;

        this.createDot(container.node, x, y, 'bottom');
        this.move = this.move.bind(this);
        this.start();
    }

    createDot(parentNode: HTMLElement, x: number, y: number, border: string) {
        this.count++;
        const params = this.getDotParams(x, y, border);

        const dot = new Dot(parentNode, params);
        dot.setFlag(true);
        dot.intersection = (x: number, y: number, border: string) => {
            
            this.flag = true;
            this.doubleDots(parentNode, x, y, border);
            this.flag = false;
        };
        this.dots.push(dot);
    }

    doubleDots(parentNode: HTMLElement, x: number, y: number, border: string) {
        if (this.count < 50) {
            this.createDot(parentNode, Math.floor(x), Math.floor(y), border);
        }
    }

    getDotParams = (x: number, y: number, border: string) => {
        const size = Math.floor(Math.random() * 8 + 5);
        let angle = (border: string) => {
            if (border === 'top') {
                return Math.random() * Math.PI;
            }
            if (border === 'bottom') {
                return Math.random() * Math.PI + Math.PI;
            }
            if (border === 'left') {
                return Math.random() < 0.5
                    ? Math.random() * (Math.PI / 2)
                    : Math.PI * 2 - Math.random() * (Math.PI / 2);
            }
            if (border === 'right') {
                return Math.random() < 0.5
                    ? Math.random() * (Math.PI / 2) + Math.PI / 2
                    : Math.PI + Math.random() * (Math.PI / 2);
            }
        };
        return {
            left: x,
            top: y,
            width: size,
            height: size,
            backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${
                Math.floor(Math.random() * 255)
            }, ${Math.floor(Math.random() * 255)}, 1)`,
            angle: angle(border),
        };
    };

    move(timestamp: number) {
        this.dots.forEach((dot) => {
            dot.findPosition(timestamp);
        });
        if (!this.flag) {
            window.requestAnimationFrame(this.move);
        }
    }

    start() {
        window.requestAnimationFrame(this.move);
    }
}

new Application(document.body);
