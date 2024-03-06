const size = 5;

const showBoard = () => document.body.style.opacity = 1;

const setBoardSize = () => {

    let minSide = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;
    let cssBoardSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 100;
    let boardSize = Math.ceil(minSide * cssBoardSize / size) * size;

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
}

const init = () => {

    setBoardSize(); 
    showBoard();
}

window.addEventListener('load', () => document.fonts.ready.then(init));