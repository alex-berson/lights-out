let board;
let size = 5;

const showBoard = () => document.body.style.opacity = 1;

const initBoard = () => board = Array.from({length: size}, () => []);

const generatePattern = () => {

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            board[i][j] = Math.round(Math.random());
        }
    } 
}

const fillBoard = () => {   

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
    fillBoard();
    showBoard();
}

window.addEventListener('load', () => document.fonts.ready.then(init));