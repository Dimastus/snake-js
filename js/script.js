'use strict';

let container = createElem('div', 'container'),
    parent = document.getElementsByClassName('container')[0],
    x = 1,
    y = 10,
    snake = [],
    direction = 'right',
    aim = null,
    steps = false,
    score = 0,
    speed = 300;

for (let i = 1; i < 101; i++) {
    if (x > 10) {
        x = 1;
        y--;
    }
    createElem('div', 'block', parent, {
        'x': x,
        'y': y
    });
    x++;
}

createElem('input', 'sail');
let input = document.querySelector('input.sail');
input.disabled = true;
input.value = `Your scores: ${score}`;

document.addEventListener("keydown", (e) => {
    if (steps === true) {
        if (e.key === "ArrowUp" && direction !== 'down') {
            direction = 'up';
            steps = false;
        }
        if (e.key === "ArrowDown" && direction !== 'up') {
            direction = 'down';
            steps = false;
        }
        if (e.key === "ArrowRight" && direction !== 'left') {
            direction = 'right';
            steps = false;
        }
        if (e.key === "ArrowLeft" && direction !== 'right') {
            direction = 'left';
            steps = false;
        }
    }
});

function createElem(nameElem = 'div', classElem = 'block', parentElem = document.body, coordinates) {
    let elem = document.createElement(nameElem);
    elem.classList.add(classElem);
    parentElem.append(elem);
    if (coordinates) {
        elem.setAttribute('data-x', coordinates.x);
        elem.setAttribute('data-y', coordinates.y);
    }
}

function randomCell() {
    let min = 3,
        max = 10,
        rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

(function createSnake() {
    let x = randomCell(),
        y = randomCell();

    snake.push(document.querySelector(`[data-x="${x}"][data-y="${y}"]`),
        document.querySelector(`[data-x="${x - 1 < 1 ? 1 : x - 1}"][data-y="${y}"]`),
        document.querySelector(`[data-x="${x - 2 < 1 ? 10 : x - 2}"][data-y="${y}"]`));

    snake.forEach(el => el.classList.add('bodySnake'));
    snake[0].classList.add('headSnake');
})();

function createAim() {
    let x = randomCell(),
        y = randomCell();

    aim = document.querySelector(`[data-x="${x + 1 > 10 ? 1 : x + 1}"][data-y="${y}"]`);

    if (aim.matches('.bodySnake') || aim.matches('.headSnake')) {
        createAim();
    } else {
        aim.classList.add('aimSnake');
        // console.log(aim.dataset.x, aim.dataset.y);
    }
};

function startStep() {
    let [x, y] = [+snake[0].dataset.x, +snake[0].dataset.y];
    let [aimX, aimY] = [+aim.dataset.x, +aim.dataset.y];

    snake[0].classList.remove('headSnake');
    snake[snake.length - 1].classList.remove('bodySnake');
    snake.pop();

    if (direction == 'right') {
        snake.unshift(document.querySelector(`[data-x="${x + 1 > 10 ? 1 : x + 1}"][data-y="${y}"]`));
    } else if (direction == 'up') {
        snake.unshift(document.querySelector(`[data-x="${x}"][data-y="${y + 1 > 10 ? 1 : y + 1}"]`));
    } else if (direction == 'down') {
        snake.unshift(document.querySelector(`[data-x="${x}"][data-y="${y - 1 < 1 ? 10 : y - 1}"]`));
    } else if (direction == 'left') {
        snake.unshift(document.querySelector(`[data-x="${x - 1 < 1 ? 10 : x - 1}"][data-y="${y}"]`));
    }

    //eat cell
    if (x === aimX && y === aimY) {
        aim.classList.remove('aimSnake');
        let a = snake[snake.length - 1].dataset.x,
            b = snake[snake.length - 1].dataset.y;
        snake.push(document.querySelector(`[data-x="${a}"][data-y="${b}"]`));
        createAim();
        score++;
        speed -= 10;
        input.value = `Your scores: ${score}`;

        clearInterval(interval);
        interval = setInterval(startStep, speed);
    }

    if (snake[0].classList.contains('bodySnake')) {
        setTimeout(() => alert('the end'), 1000);
        clearInterval(interval);
        snake.forEach(el => el.classList.add('opacity'));
        snake.forEach(el => el.style.backgroundColor = 'green');
        input.value = `Your scores: ${score}`;
    }

    snake[0].classList.add('headSnake');
    snake.forEach(el => el.classList.add('bodySnake'));

    steps = true;
}

createAim();
let interval = setInterval(startStep, speed);

/*setTimeout(() => {
    clearInterval(interval);
}, 10000);*/