let board;
let size = 5;

const showBoard = () => document.body.style.opacity = 1;

const initBoard = () => board = Array.from({length: size}, () => []);

const createToggleMatrix = () => {

    const index = (i, j) => i * size + j;

    let matrix = Array.from({length: size ** 2}, () => Array(size ** 2).fill(0));

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {

            matrix[index(i, j)][index(i, j)] = 1;

            if (i - 1 >= 0) matrix[index(i, j)][index(i - 1, j)] = 1;
            if (i + 1 < size) matrix[index(i, j)][index(i + 1, j)] = 1;
            if (j - 1 >= 0) matrix[index(i, j)][index(i, j - 1)] = 1;
            if (j + 1 < size) matrix[index(i, j)][index(i, j + 1)] = 1;
        }
    }

    return matrix;
}

const gaussianEliminationMod2  = () => {

    let n = size ** 2;
    let matrix = createToggleMatrix();
    let target = board.flat();

    for (let i = 0; i < n; i++) {
        matrix[i].push(target[i]);
    }

    for (let i = 0; i < n; i++) {

        let pivot;

        for (let row = i; row < n; row++) {
            if (matrix[row][i] == 1) {
                pivot = row;
                break;
            }
        }

        if (pivot == undefined) continue;
        if (pivot != i) [matrix[i], matrix[pivot]] = [matrix[pivot], matrix[i]];

        for (let j = i + 1; j < n; j++) {
            if (matrix[j][i] == 1) {
                for (let k = i; k <= n; k++) {
                    matrix[j][k] ^= matrix[i][k];
                }
            }
        }
    }

    for (let i = 0; i < n; i++) {
        if (matrix[i].every((val, idx) => val == 0 || idx == n) && matrix[i][n] == 1) return null; 
    }

    let solution = Array(n).fill(0);

    for (let i = n - 1; i >= 0; i--) {

        let sum = matrix[i][n];

        for (let j = i + 1; j < n; j++) {
            sum ^= (matrix[i][j] & solution[j]);
        }

        solution[i] = sum;
    }

    return solution;
}

const generatePattern = () => {

    do {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                board[i][j] = Math.round(Math.random());
            }
        } 
    } while (gaussianEliminationMod2() == null);
}

const refreshBoard = () => {   

    let cells = document.querySelectorAll('.cell');

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            cells[i * size + j].classList.toggle('on', board[i][j]);
        }
    }   
}

const setBoardSize = () => {

    let minSide = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;
    let cssBoardSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 100;
    let boardSize = Math.ceil(minSide * cssBoardSize / size) * size;

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
}

const toggleLights = (e) => {

    let cell = e.target;
    let i = Math.floor([...cell.parentNode.children].indexOf(cell) / size);
    let j = [...cell.parentNode.children].indexOf(cell) % size;

    board[i][j] ^= 1;

    if (i - 1 >= 0) board[i - 1][j] ^= 1;
    if (i + 1 < size) board[i + 1][j] ^= 1;
    if (j - 1 >= 0) board[i][j - 1] ^= 1;
    if (j + 1 < size) board[i][j + 1] ^= 1;

    refreshBoard();
}

const enableTouch = () => {

    let cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
        cell.addEventListener('touchstart', toggleLights);
        cell.addEventListener('mousedown', toggleLights);
    });
}

const disableTouch = () => {

    let cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
        cell.removeEventListener('touchstart', toggleLights);
        cell.removeEventListener('mousedown', toggleLights);
    });
}

const disableTapZoom = () => {

    const preventDefault = (e) => {e.preventDefault()};

    document.body.addEventListener('touchstart', preventDefault, {passive: false});
    document.body.addEventListener('mousedown', preventDefault, {passive: false});
}

const init = () => {

    disableTapZoom();
    setBoardSize(); 
    initBoard();
    generatePattern();
    refreshBoard();
    showBoard();
    enableTouch();
}

window.addEventListener('load', () => document.fonts.ready.then(init));