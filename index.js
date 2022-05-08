const container = document.createElement('div');
container.classList.add('container');
document.body.append(container);

container.onclick = (e) => {
    console.log(e.clientX, e.clientY);
};

const dot = document.createElement('div');
dot.classList.add('dot');

container.append(dot);

let x = 700 / 2 - 10 / 2;
let y = 500 / 2 - 10 / 2;

dot.style.top = `${y}px`;
dot.style.left = `${x}px`;

let angle = 45;

let flag = false;

const handleIntersect = (entries, observer) => {
    entries.forEach((entry) => {
        if (!(entry.intersectionRatio > 0)) {
            flag = true;
        }
    });

    console.log('Intersect!');
};

const createObserver = () => {
    const options = {
        root: container,
        rootMargin: '-12px',
        threshold: [0.0],
    };

    return new IntersectionObserver(handleIntersect, options);
};

const move = (timestamp) => {
    x += Math.cos(angle);
    y += Math.sin(angle);
    dot.style.top = `${y}px`;
    dot.style.left = `${x}px`;
    //if (x < 700 - 10 && y < 500 - 10) {
    if (!flag) {
        window.requestAnimationFrame(move);
    }
};

const observer = createObserver();
observer.observe(dot);

window.requestAnimationFrame(move);
