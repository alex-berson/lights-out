let board;

const SIZE = 3;

const showBoard = () => document.body.classList.add('visible');

const initBoard = () => board = Array.from({length: SIZE}, () => []);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const puzzleSolved = () => board.every(row => row.every(sq => sq == 0));

const setBoardSize = () => {

    let minSide = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;
    let cssBoardSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 100;
    let boardSize = Math.ceil(minSide * cssBoardSize / SIZE) * SIZE;

    document.documentElement.style.setProperty('--board-size', `${boardSize}px`);
}

const generatePattern = () => {

    do {
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                board[i][j] = Math.round(Math.random());
            }
        } 
    } while (gaussianEliminationMod2() == null || puzzleSolved());

    //  board = [[1,1,1],
    //            1,1,1],
    //           [1,1,1]]; 
}

const gaussianEliminationMod2  = () => {

    let n = SIZE ** 2;
    let target = board.flat();
    let matrix = createToggleMatrix();

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

const createToggleMatrix = () => {

    const index = (i, j) => i * SIZE + j;

    let matrix = Array.from({length: SIZE ** 2}, () => Array(SIZE ** 2).fill(0));

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {

            matrix[index(i, j)][index(i, j)] = 1;

            if (i - 1 >= 0) matrix[index(i, j)][index(i - 1, j)] = 1;
            if (i + 1 < SIZE) matrix[index(i, j)][index(i + 1, j)] = 1;
            if (j - 1 >= 0) matrix[index(i, j)][index(i, j - 1)] = 1;
            if (j + 1 < SIZE) matrix[index(i, j)][index(i, j + 1)] = 1;
        }
    }

    return matrix;
}

const redrawBoard = () => {   

    let cells = document.querySelectorAll('.cell');

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            cells[i * SIZE + j].classList.toggle('on', board[i][j]);
        }
    }   

    return;
}

// const redrawBoard = async () => {

//     let cells = [...document.querySelectorAll('.cell')];

//     await Promise.all(cells.map((cell, idx) => new Promise(resolve => {

//             let i = Math.floor(idx / SIZE);
//             let j = idx % SIZE;
            
//             if ((board[i][j] && !cell.classList.contains('on')) ||
//                 (!board[i][j] && cell.classList.contains('on'))) {

//                 cell.classList.toggle('on')

//                 cell.addEventListener('transitionend', resolve, {once: true});

//             } else {
//                 resolve();
//             }
//     })));
// }


const toggleLights = (e) => {
    
    let cell = e.currentTarget;
    let i = Math.floor([...cell.parentNode.children].indexOf(cell) / SIZE);
    let j = [...cell.parentNode.children].indexOf(cell) % SIZE;

    board[i][j] ^= 1;

    if (i - 1 >= 0) board[i - 1][j] ^= 1;
    if (i + 1 < SIZE) board[i + 1][j] ^= 1;
    if (j - 1 >= 0) board[i][j - 1] ^= 1;
    if (j + 1 < SIZE) board[i][j + 1] ^= 1;

    redrawBoard();
    showHints();

    // if (puzzleSolved()) gameOver();

    // if (puzzleSolved()) setTimeout(gameOver, 0);

    // await sleep(0);

    if (puzzleSolved()) gameOver();
}

const toggleHints = async () => {

    let dot = document.querySelector('.button .dot');
    let button = document.querySelector('.button');

    if (puzzleSolved()) return;

    // button.classList.toggle('on');
    button.classList.add('blink');

    button.addEventListener('animationend', () => button.classList.remove('blink'), {once: true});

    // setTimeout(showHints, 200);

    await sleep(100);
    dot.classList.toggle('on');
    showHints();
}

const showHints = () => {

    let solution = gaussianEliminationMod2();
    let dot = document.querySelector('.button .dot');
    let on = dot.classList.contains('on');
    let dots = document.querySelectorAll('.cell .dot');

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            dots[i * SIZE + j].classList.toggle('on', solution[i * SIZE + j] * on);
        }
    }
}

const gameOver = async () => {

    let dot = document.querySelector('.dot');
    let board = document.querySelector('.board');
    let button = document.querySelector('.button');
    let letterI = document.querySelector('.letter-i');

    disableTouch();

    // button.classList.remove('on');
    dot.classList.remove('on');
    letterI.classList.add('off');
    button.classList.add('off');

    await paintBlackSquare(); 
    
    board.addEventListener('touchstart', newGame);
    board.addEventListener('mousedown', newGame);
}

const paintBlackSquare = async () => {

    // let cells = document.querySelectorAll('.cell');

    let cells = [...document.querySelectorAll('.cell')];

    await Promise.all(cells.map((cell, idx) => new Promise(resolve => {

            let i = Math.floor(idx / SIZE);
            let j = idx % SIZE;

    // for (let i = 0; i < SIZE; i++) {
        // for (let j = 0; j < SIZE; j++) {
           
            let x = 50, y = 50;
            // let cell = cells[i * SIZE + j];

            if (i % SIZE == 0) y = 0;
            if (i % SIZE == SIZE - 1) y = 100;
            if (j % SIZE == 0) x = 0;
            if (j % SIZE == SIZE - 1) x = 100;

            cell.style.transformOrigin = `${x}% ${y}%`;
            cell.classList.add('scale');

            cell.addEventListener('transitionend', () => {

                cell.classList.add('instant');

                resolve();
                
            }, {once: true});
        // }
    // }
    })));
}

const newGame = () => {

    let board = document.querySelector('.board');
    let cells = document.querySelectorAll('.cell');
    let button = document.querySelector('.button');
    let letterI = document.querySelector('.letter-i');
   
    board.removeEventListener('touchstart', newGame);
    board.removeEventListener('mousedown', newGame);

    letterI.classList.remove('off');
    button.classList.remove('off');

    cells.forEach(cell => cell.classList.remove('scale'));

    generatePattern();
    redrawBoard();

    // await sleep(0);

    requestAnimationFrame(() => {
        cells.forEach(cell => cell.classList.remove('instant'));
    });

    enableTouch();
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

const enableHints = () => {

    let button = document.querySelector('.button');

    button.addEventListener('touchstart', toggleHints);
    button.addEventListener('mousedown', toggleHints);
}

const disableHints = () => {

    let button = document.querySelector('.button');

    button.removeEventListener('touchstart', toggleHints);
    button.removeEventListener('mousedown', toggleHints);
}

const disableScreen = () => {

    const preventDefault = (e) => e.preventDefault();

    document.body.addEventListener('touchstart', preventDefault, {passive: false});
    document.body.addEventListener('mousedown', preventDefault, {passive: false});
}

const init = () => {

    disableScreen();
    setBoardSize(); 
    initBoard();
    generatePattern();
    redrawBoard();
    showBoard();
    enableTouch();
    enableHints();

    // toggleHints(); //


    enableReset(); //
}

const enableReset = () => {

    let resetBtn = document.querySelector('.reset');

    resetBtn.addEventListener('touchstart', newGame);
    resetBtn.addEventListener('mousedown', newGame);
}

window.onload = () => document.fonts.ready.then(init);