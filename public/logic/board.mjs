/**
 * Fail, kus sisalduvad mängulauda puutuvad muutujad ja funktsioonid
 * 
 * https://en.wikipedia.org/wiki/Scrabble
 * Scrabble. Game details
 * multipliers - ametlik Scrabble'i mängulaua disain
 */

/**
 * board - mängulaud
 * nultiploiers - mängulaua preemiaruudud
 * transposed - mängulaua seis
 * verticalWords - käikudega tekitatud vertikaalsed sõnad
 * horizontalWords - käikudega tekitatud horisontaalsed sõnad
 */
export var board;
export var multipliers;
export var transposed;
export var verticalWords;
export var horizontalWords;

/**
 * Funktsioon mängulaua initsialiseerimiseks
 */
export function initBoard() {
    board = [
    //    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], // 0
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], // 1
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], // 2
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], // 3
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], // 4
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], // 5
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], // 6
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], // 7
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], // 8
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], // 9
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], // 10
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], // 11
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], // 12
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], // 13
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], // 14
    ];
    multipliers = [
    //    0     1     2     3     4     5     6     7     8     9     10    11    12    13    14
        ['3w', '1',  '1',  '2l', '1',  '1',  '1',  '3w', '1',  '1',  '1',  '2l', '1',  '1',  '3w'], // 0
        ['1',  '2w', '1',  '1',  '1',  '3l', '1',  '1',  '1',  '3l', '1',  '1',  '1',  '2w', '1'],  // 1
        ['1',  '1',  '2w', '1',  '1',  '1',  '2l', '1',  '2l', '1',  '1',  '1',  '2w', '1',  '1'],  // 2
        ['2l', '1',  '1',  '2w', '1',  '1',  '1',  '2l', '1',  '1',  '1',  '2w', '1',  '1',  '2l'], // 3
        ['1',  '1',  '1',  '1',  '2w', '1',  '1',  '1',  '1',  '1',  '2w', '1',  '1',  '1',  '1'],  // 4
        ['1',  '3l', '1',  '1',  '1',  '3l', '1',  '1',  '1',  '3l', '1',  '1',  '1',  '3l', '1'],  // 5
        ['1',  '1',  '2l', '1',  '1',  '1',  '2l', '1',  '2l', '1',  '1',  '1',  '2l', '1',  '1'],  // 6
        ['3w', '1',  '1',  '2l', '1',  '1',  '1',  '2w', '1',  '1',  '1',  '2l', '1',  '1',  '3w'], // 7
        ['1',  '1',  '2l', '1',  '1',  '1',  '2l', '1',  '2l', '1',  '1',  '1',  '2l', '1',  '1'],  // 8
        ['1',  '3l', '1',  '1',  '1',  '3l', '1',  '1',  '1',  '3l', '1',  '1',  '1',  '3l', '1'],  // 9
        ['1',  '1',  '1',  '1',  '2w', '1',  '1',  '1',  '1',  '1',  '2w', '1',  '1',  '1',  '1'],  // 10
        ['2l', '1',  '1',  '2w', '1',  '1',  '1',  '2l', '1',  '1',  '1',  '2w', '1',  '1',  '2l'], // 11
        ['1',  '1',  '2w', '1',  '1',  '1',  '2l', '1',  '2l', '1',  '1',  '1',  '2w', '1',  '1'],  // 12
        ['1',  '2w', '1',  '1',  '1',  '3l', '1',  '1',  '1',  '3l', '1',  '1',  '1',  '2w', '1'],  // 13
        ['3w', '1',  '1',  '2l', '1',  '1',  '1',  '3w', '1',  '1',  '1',  '2l', '1',  '1',  '3w'], // 14
    ];
    transposed = false;
    verticalWords = [];
    horizontalWords = [];
}

/**
 * Funktisoon mängulaua transponeerimiseks
 */
export function transpose() {
    var transposedBoard = [];
    for (var row = 0; row < 15; row++) {
        transposedBoard.push([]);
        for (var col = 0; col < 15; col++) {
            transposedBoard[row].push(board[col][row]);
        }
    }
    board = transposedBoard;
    transposed = !transposed;
}

/**
 * Funktsioon ankruruutude leidmiseks (kasutatakse arvuti käigu tegemisel)
 * Tagastab ankruruudud
 */
export function findAnchorSquares() {
    var anchorSquares = [];
    for (var row = 0; row < 15; row++) {
        var limit = 0;
        for (var col = 0; col < 15; col++) {
            limit += 1;
            if (board[row][col-1] == '0' && board[row][col] != '0') {
                anchorSquares.push([row, col-1, limit]);
            } else if (board[row][col-1] != '0') {
                limit = 0;
            }
        }
    }
    return anchorSquares;
}

/**
 * Funktsioon ankruruutude leidmiseks (kasutatakse mängija käikude kontrollimiseks)
 * Tagastab ankruruudud
 */
export function findAllAnchorSquares() {
    var anchorSquares = [];
    for (var row = 0; row < 15; row++) {
        for (var col = 1; col < 15; col++) {
            if (board[row][col-1] == '0' && board[row][col] != '0') {
                anchorSquares.push([row, col-1]);
            }
            if (board[row][col] == '0' && board[row][col-1] != '0') {
                anchorSquares.push([row, col]);
            }
        }
    }
    for (var col = 0; col < 15; col++) {
        for (var row = 1; row < 15; row++) {
            if (board[row-1][col] == '0' && board[row][col] != '0') {
                anchorSquares.push([row-1, col]);
            }
            if (board[row][col] == '0' && board[row-1][col] != '0') {
                anchorSquares.push([row, col]);
            }
        }
    }
    return anchorSquares;
}

/**
 * Funktsioon mängulaua seisundi uuendamiseks
 * move - Leitud käik
 */
export function updateBoard(move) {
    var [word, row, col, vertical] = move;
    for (var j = col; j < col+word.length; j++) {
        var letter = word[j-col];
        if (vertical) {
            if (letter == letter.toUpperCase()) {
                board[j][row] = letter.toLowerCase();
                multipliers[j][row] = '-';
            } else {
                board[j][row] = letter;
                multipliers[j][row] = '0';
            }
        } else {
            if (letter == letter.toUpperCase()) {
                board[row][j] = letter.toLowerCase();
                multipliers[row][j] = '-';
            } else {
                board[row][j] = letter;
                multipliers[row][j] = '0';
            }
        }
    }
}
