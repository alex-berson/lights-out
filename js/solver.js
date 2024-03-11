let board;
let size = 5;

const initBoard = () => board = Array.from({length: size}, () => []);

// const initBoard = () => {

//     board = [];

//     for (let i = 0; i < size; i++) {
        
//         board[i] =  [];

//     }
// }

const generatePattern = () => {

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {

            board[i][j] = Math.round(Math.random());

            // board[i][j] = 0;

        }
    }

    //  board = [[0,0,0,0,0],
    //           [0,0,0,0,0],
    //           [0,0,0,1,0],
    //           [0,0,0,1,1],
    //           [0,0,1,1,0]];     
}

const dotProductMod2 = (a, b) => {

    let sum = 0;

    for (let i = 0; i < a.length; i++) {
        sum += a[i] * b[i];
    }

    return sum % 2 == 0;
}

const puzzleSolvable = () => {
        
    let n1 = [0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0];
    let n2 = [1,0,1,0,1,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,1,0,1,0,1];

    return dotProductMod2(board.flat(), n1) && dotProductMod2(board.flat(), n2);
}

const createToggleMatrix = () => {

    // let matrix = [];
    let matrix = Array.from({length: size ** 2}, () => Array(size ** 2).fill(0));

    // console.table(matrix);

    // for (let i = 0; i < size; i++) {
    //     for (let j = 0; j < size; j++) {
            
    //         // matrix[i * size + j] = [...Array(size * size)].map(() => 0);

    //         matrix[i * size + j][i * size + j] = 1;

    //         if (i - 1 >= 0) matrix[i * size + j][(i - 1) * size + j] = 1;
    //         if (i + 1 < size) matrix[i * size + j][(i + 1) * size + j] = 1;
    //         if (j - 1 >= 0) matrix[i * size + j][i * size + j - 1] = 1;
    //         if (j + 1 < size) matrix[i * size + j][i * size + j + 1] = 1;            
    //     }
    // }

    const index = (i, j) => i * size + j;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {

            // matrix[index(i, j)] = Array(size * size).fill(0);
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

const puzzleSolved = () => board.every(row => row.every(cell => cell == 0));

const solvePuzzle = (solution) => {

    let n = size ** 2 ;

    for (let i = 0; i < n; i++) {

        if (solution[i] == 1) {

            let x = Math.floor(i / size);
            let y = i % size;

            board[x][y] ^= 1;

            if (x - 1 >= 0) board[x - 1][y] ^= 1;
            if (x + 1 < size) board[x + 1][y] ^= 1;
            if (y - 1 >= 0) board[x][y - 1] ^= 1;
            if (y + 1 < size) board[x][y + 1] ^= 1;
        }
    }
}

const init = () => {

    initBoard();
    generatePattern();

    console.table([...board]);
    console.log(puzzleSolvable());

    // let pattern = Array(size ** 2).fill(1);


    let solution = gaussianEliminationMod2();
    console.log("Solution: ", solution);

    if (solution != null) {
        solvePuzzle(solution);
        console.table([...board]);
    }
}

init();