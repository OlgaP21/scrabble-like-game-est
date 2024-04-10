/**
 * Fail, kus sisalduvad mängija sisendi kontrollimiseks vajalikud funktsioonid
 */


import { playerRack, scores } from './bag.mjs';
import { board, multipliers, transposed, horizontalWords, verticalWords } from './board.mjs';
import { dictionary, themedDictionary, theme } from "./dictionary.mjs";

import { updatePlayerRack } from './bag.mjs';
import  { findAllAnchorSquares, updateBoard, } from './board.mjs';


/**
 * vertical - kas mängija pakutud sõna on vertikaalne
 * horizontal - kas mängija pakutud sõna on horisontaalne
 * move - mängija käik
 * createdWords - käiguga tekitatud sõnad
 * usedLetters - kasutatud tähed
 * letterBoardIndexes - kasutatud tähtede indeksid
 */
var vertical;
var horizontal;
var move;
var createdWords;
var usedLetters;
var letterBoardIndexes;

/**
 * Funktsioon mängijaseisu tühistamiseks enne uut käiku
 */
export function reset() {
    vertical = true;
    horizontal = true;
    move = [];
    createdWords = [];
    letterBoardIndexes = [];
    usedLetters = [];
}

/**
 * Funktsioon esimese käigu kontrollimiseks ja sooritamiseks
 * playerLetters - Mängija tähed
 * Tagastab kasutatud tähtede indeksid, käigu skoor, käiguga tekitatud sõnad
 */
export function makeFirstPlayerMove(playerLetters) {
    reset();
    var usedLettersIndexes = checkLettersOnBoard(playerLetters);
    if (usedLettersIndexes.length < 2) {
        throw 'Sõna peab koosnema vähemalt kahest tähest';
    } else {
        if (!checkLettersContinuous(playerLetters, usedLettersIndexes)) throw 'Tähed tuleb asetada ühele sirgjoonele';
        var possibleWord = getPlayerMove(playerLetters, usedLettersIndexes);
        if (!checkUsedCentralSquare()) throw 'Peab kasutama keskruutu';
        if (!checkMoveLettersInOrder()) throw 'Tähti ei tohi üksteise peale panna';
        if (!checkFirstMoveWithoutBreaks()) throw 'Sõnas ei tohi olla tühikuid';
        if (!dictionary.find(possibleWord.toLowerCase())) throw `Sõna \'${possibleWord.toLowerCase()}\' ei ole sõnastikust leitud`;
        var row = vertical ? letterBoardIndexes[0][1] : letterBoardIndexes[0][0];
        var col = vertical ? letterBoardIndexes[0][0] : letterBoardIndexes[0][1];
        createdWords.push([possibleWord, row, col, vertical]);
        var score = scoreMove();
        move = createdWords[0];
        updatePlayerState();
        if (usedLetters.length == 7) score += 50;
        updatePlayerRack(usedLetters);
        return [usedLettersIndexes, score, createdWords];
    }
}

/**
 * Funktsioon tavalise käigu kontrollimiseks ja sooritamiseks
 * playerLetters - Mangija tähed
 * Tagastab kasutatud tähtede indeksid, käigu skoor, käiguga tekitatud sõnad, veateade
 */
export function makePlayerMove(playerLetters) {
    reset();
    var usedLettersIndexes = checkLettersOnBoard(playerLetters);
    var err = undefined;
    if (usedLettersIndexes.length == 0) {
        throw 'Sõna peab koosnema vähemalt kahest tähest';
    } else if (usedLettersIndexes.length == 1) {
        var letter = playerRack[usedLettersIndexes[0]];
        var index = getLetterBoardIndex(playerLetters, usedLettersIndexes);
        if (board[index[0]][index[1]] != '0') throw 'Tähti ei tohi üksteise peale panna';
        if (!checkUsedAnchorSquare(index[0], index[1])) throw 'Peab kasutama vähemalt ühte olemasoleva sõna tähte';
        try {
            var newWords = findCreatedWords(letter, index);
            createdWords = newWords;
            var score = scoreMove();
            move = createdWords[0];
            updatePlayerState();
            updatePlayerRack(usedLetters);
        } catch (e) {
            err = e;
        } finally {
            return {
                value: [usedLettersIndexes, score, createdWords],
                error: err
            }
        }
    } else {
        if (!checkLettersContinuous(playerLetters, usedLettersIndexes)) throw 'Tähed tuleb asetada ühele sirgjoonele';
        var possibleWord = getPlayerMove(playerLetters, usedLettersIndexes);
        if (!checkMoveLettersInOrder()) throw 'Tähti ei tohi üksteise peale panna';
        if (!checkUsedAnchorSquares()) throw 'Peab kasutama vähemalt ühte olemasoleva sõna tähte';
        if (!checkMoveWithoutBreaks()) throw 'Sõnas ei tohi olla tühikuid';
        var word, row, col;
        if (vertical) {
            [word, row, col] = getVerticalMove(possibleWord);
        } else {
            [word, row, col] = getHorizontalMove(possibleWord);
        }
        if (theme && !themedDictionary.find(word.toLowerCase()) || !dictionary.find(word.toLowerCase())) {
            throw `Sõna \'${word.toLowerCase()}\' ei ole sõnastikust leitud`;
    }
        findNewWords(word, row, col, vertical);
        var score = scoreMove();
        move = [word, row, col, vertical];
        updatePlayerState();
        if (usedLetters.length == 7) score += 50;
        try {
            updatePlayerRack(usedLetters);
        } catch (e) {
            err = e;
        } finally {
            return {
                value: [usedLettersIndexes, score, createdWords],
                error: err
            }
        }
    }
}

/**
 * Funktsioon kontrollimiseks kas mängija on tähed mängulauale asetanud
 * playerLetters - Mängija tähed
 * Tagastab mängulauale asetatud tähtede indeksid
 */
function checkLettersOnBoard(playerLetters) {
    var usedLettersIndexes = [];
    for (var lx in playerLetters) {
        var letter = playerLetters[lx];
        if (letter.x >= 60 && letter.y >= 60) {
            usedLettersIndexes.push(lx);
        }
    }
    return usedLettersIndexes;
}

/**
 * Funktsioon kontrollimiseks kas kõik tähed on ühele joonele asetatud (vertikaalselt või horisontaalselt)
 * playerLetters - Mängija tähed
 * usedLettersIndexes - Kasutatud tähtede indeksid
 * Tagastab tõeväärtuse kas tähed asetsevad ühel sirgel joonel
 */
function checkLettersContinuous(playerLetters, usedLettersIndexes) {
    var x = playerLetters[usedLettersIndexes[0]].x;
    var y = playerLetters[usedLettersIndexes[0]].y;
    var moveVertical = true;
    var moveHorizontal = true;
    for (var lx in usedLettersIndexes) {
        var index = usedLettersIndexes[lx];
        if (playerLetters[index].x != x) moveVertical = false;
        if (playerLetters[index].y != y) moveHorizontal = false;
    }
    if (!moveVertical && !moveHorizontal) return false;
    vertical = moveVertical;
    horizontal = moveHorizontal;
    return true;
}

/**
 * Funktsioon mängija tähtedest tekitatud sõna leidmiseks
 * playerLetters - Mängija tähed
 * usedLettersIndexes - Kasutatud tähtede indeksid
 * Tagastab leitud sõna
 */
function getPlayerMove(playerLetters, usedLettersIndexes) {
    var items = [];
    var word = '';
    for (var ix in usedLettersIndexes) {
        var index = usedLettersIndexes[ix];
        items.push([index, playerLetters[index]]);
    }
    if (vertical) {
        items.sort(function(first, second) {
            return first[1].y - second[1].y;
        });
    } else {
        items.sort(function(first, second) {
            return first[1].x - second[1].x;
        });
    }
    for (var ix in items) {
        var index = items[ix][0];
        if (playerLetters[index].data) {
            word += playerLetters[index].data;
        } else {
            word += playerRack[index];
        }
        var row, col;
        if (vertical) {
            row = (items[ix][1].x - 60) / 30;
            col = (items[ix][1].y - 60) / 30;
        } else {
            row = (items[ix][1].y - 60) / 30;
            col = (items[ix][1].x - 60) / 30;
        }
        letterBoardIndexes.push([row, col]);
    }
    return word;
}

/**
 * Funktsioon kontrollimiseks kas keskruut on kasutatud (vajalik esimese käigu jaoks)
 * Tagastab kas keskruutu on käigu tegemiseks kasutatud
 */
function checkUsedCentralSquare() {
    for (var lx in letterBoardIndexes) {
        var row = letterBoardIndexes[lx][0];
        var col = letterBoardIndexes[lx][1];
        if (row == 7 && col == 7) return true;
    }
    return false;
}

/**
 * Funktsioon kontrollimiseks kas tähed ei ole üksteise peale pandud
 * Tagastab kas tähed ei ole üksteise peale pandud
 */
function checkMoveLettersInOrder() {
    if (vertical) {
        for (var lx in letterBoardIndexes) {
            var row = letterBoardIndexes[lx][1];
            var col = letterBoardIndexes[lx][0];
            if (board[row][col] != '0') return false;
        }
    } else {
        for (var lx in letterBoardIndexes) {
            var row = letterBoardIndexes[lx][0];
            var col = letterBoardIndexes[lx][1];
            if (board[row][col] != '0') return false;
        }
    }
    const coordinates = new Set();
    for (var lx in letterBoardIndexes) {
        coordinates.add(letterBoardIndexes[lx][1]);
    }
    return coordinates.size == letterBoardIndexes.length;
}

/**
 * Funktsioon kontrollimiseks kas sõnas on tühikuid (vajalik esimese käigu jaoks)
 * Tagastab kas sõna on tühikuteta
 */
function checkFirstMoveWithoutBreaks() {
    for (var i = 1; i < letterBoardIndexes.length; i++) {
        if (letterBoardIndexes[i][1] - letterBoardIndexes[i-1][1] != 1) return false;
    }
    return true;
}

/**
 * Funktsioon käiguga tekitatud uute sõnade leidmiseks
 * possibleWord - Leitud sõna
 * row - Rea number
 * col - Veeru number
 * vertical - Kas sõna on vertikaalne või horisontaalne
 */
function findNewWords(possibleWord, row, col, vertical) {
    var boardCopy = [];
    for (var i = 0; i < 15; i++) {
        boardCopy.push([]);
        for (var j = 0; j < 15; j++) {
            if (transposed) boardCopy[i].push(board[j][i]);
            else boardCopy[i].push(board[i][j]);
        }
    }
    for (var j = col; j < col+possibleWord.length; j++) {
        if (vertical) boardCopy[j][row] = possibleWord[j-col];
        else boardCopy[row][j] = possibleWord[j-col];
    }
    for (var i = 0; i < 15; i++) {
        var word = '';
        for (var j = 0; j < 15; j++) {
            var boardLetter = boardCopy[i][j];
            if (boardLetter == '0' && word.length == 1) {
                word = '';
            } else if (boardLetter == '0' && word.length > 1) {
                if (checkWord(word, i, j-word.length, false)) {
                    createdWords.push([word, i, j-word.length, false]);
                }
                word = '';
            } else if (boardLetter != '0') {
                word += boardLetter;
            }
        }
        if (word.length > 1 && checkWord(word, i, 15-word.length, false)) {
            createdWords.push([word, i, 15-word.length, false]);
        }
    }
    for (var j = 0; j < 15; j++) {
        var word = '';
        for (var i = 0; i < 15; i++) {
            var boardLetter = boardCopy[i][j];
            if (boardLetter == '0' && word.length == 1) {
                word = '';
            } else if (boardLetter == '0' && word.length > 1) {
                if (checkWord(word, j, i-word.length, true)) {
                    createdWords.push([word, j, i-word.length, true]);
                }
                word = '';
            } else if (boardLetter != '0') {
                word += boardLetter;
            }
        }
        if (word.length > 1 && checkWord(word, j, 15-word.length, true)) {
            createdWords.push([word, j, 15-word.length, true]);
        }
    }
}

/**
 * Funktsioon kontrollimiseks kas leitud käik langeb juba mõne varem tehtud käiguga kokku
 * possibleWord - Leitud sõna
 * row - Rea number
 * col - Veeru number
 * vertical - Kas sõna on vertikaalne või horisontaalne
 * Tagastab käigu olemasolu varasemate käikude hulgas
 */
function checkWord(possibleWord, row, col, vertical) {
    var find;
    if (vertical) {
        find = verticalWords.find((elem) => elem[0]==possibleWord && elem[1]==row && elem[2]==col);
    } else {
        find = horizontalWords.find((elem) => elem[0]==possibleWord && elem[1]==row && elem[2]==col);
    }
    if (find) return false;
    return true;
}

/**
 * Funktsioon käigu skoorimiseks
 * Tagastab käigu skoori (siin ei arvestata 50 boonuspunkti)
 */
function scoreMove() {
    var totalScore = 0;
    for (var wx in createdWords) {
        var [word, row, col, vertical] = createdWords[wx];
        var wordMultiplier = 1;
        var score = 0;
        for (var j = col; j < col+word.length; j++) {
            var letter = word[j-col];
            var letterMultiplier = 1;
            var squareMultiplier;
            if (vertical) squareMultiplier = multipliers[j][row];
            else squareMultiplier = multipliers[row][j];
            if (squareMultiplier == '2l') {
                letterMultiplier = 2;
            } else if (squareMultiplier == '3l') {
                letterMultiplier = 3;
            } else if (squareMultiplier == '-') {
                letterMultiplier = 0;
            } else if (squareMultiplier == '2w') {
                wordMultiplier *= 2;
            } else if (squareMultiplier == '3w') {
                wordMultiplier *= 3;
            }
            if (letter != letter.toUpperCase()) score += scores[letter] * letterMultiplier;
        }
        score *= wordMultiplier;
        if (theme && themedDictionary.find(word.toLowerCase())) {
            score += word.length;
        }
        totalScore += score;
    }
    return totalScore;
}

/**
 * Funktsioon mängija seisundi uuendamiseks
 * Tagastab kasutatud tähed
 */
function updatePlayerState() {
    for (var wx in createdWords) {
        var [word, row, col, vertical] = createdWords[wx];
        if (vertical) verticalWords.push([word.toLowerCase(), row, col]);
        else horizontalWords.push([word.toLowerCase(), row, col]);
    }
    var [word, row, col, vertical] = move;
    for (var j = col; j < col+word.length; j++) {
        if (vertical) {
            if (multipliers[j][row] != '0') {
                usedLetters.push(word[j-col]);
            }
        } else {
            if (multipliers[row][j] != '0') {
                usedLetters.push(word[j-col]);
            }
        }
    }
    updateBoard(move);
    return usedLetters;
}

/**
 * Funktsioon tähe mängulaua indeksite leidmiseks
 * playerLetters - Mängija tähed
 * usedLettersIndexes - Kasutatud tähtede indeksid
 * Tagastab tähe positsioon mängulaual
 */
function getLetterBoardIndex(playerLetters, usedLettersIndexes) {
    var index = usedLettersIndexes[0];
    var row = (playerLetters[index].y - 60) / 30;
    var col = (playerLetters[index].x - 60) / 30;
    return [row, col];
}

/**
 * Funktsioon käiguga tekitatud uute sõnade leidmiseks
 * letter - Täht
 * index - Tähe positsioon mängulaual
 * Tagastab kõik käiguga tekitatud uued sõnad
 */
function findCreatedWords(letter, index) {
    var [row, col] = index;
    var boardCopy = [];
    for (var i = 0; i < 15; i++) {
        boardCopy.push([]);
        for (var j = 0; j < 15; j++) {
            if (transposed) boardCopy[i].push(board[j][i]);
            else boardCopy[i].push(board[i][j]);
        }
    }
    boardCopy[row][col] = letter;
    var newWords = [];
    for (var i = 0; i < 15; i++) {
        var word = '';
        for (var j = 0; j < 15; j++) {
            var boardLetter = boardCopy[i][j];
            if (boardLetter == '0' && word.length == 1) {
                word = '';
            } else if (boardLetter == '0' && word.length > 1) {
                if (theme && !themedDictionary.find(word.toLowerCase()) || !dictionary.find(word.toLowerCase())) {
                    throw `Sõna \'${word.toLowerCase()}\' ei ole sõnastikust leitud`;
                }
                if (checkWord(word, i, j-word.length, false)) {
                    newWords.push([word, i, j-word.length, false]);
                }
                word = '';
            } else if (boardLetter != '0') {
                word += boardLetter;
            }
        }
        if (word.length > 1 && checkWord(word, i, 15-word.length, false)) {
            newWords.push([word, i, 15-word.length, false]);
        }
    }
    for (var j = 0; j < 15; j++) {
        var word = '';
        for (var i = 0; i < 15; i++) {
            var boardLetter = boardCopy[i][j];
            if (boardLetter == '0' && word.length == 1) {
                word = '';
            } else if (boardLetter == '0' && word.length > 1) {
                if (theme && !themedDictionary.find(word.toLowerCase()) || !dictionary.find(word.toLowerCase())) {
                    throw `Sõna \'${word.toLowerCase()}\' ei ole sõnastikust leitud`;
                }
                if (checkWord(word, j, i-word.length, true)) {
                    newWords.push([word, j, i-word.length, true]);
                }
                word = '';
            } else if (boardLetter != '0') {
                word += boardLetter;
            }
        }
        if (word.length > 1 && checkWord(word, j, 15-word.length, true)) {
            newWords.push([word, j, 15-word.length, true]);
        }
    }
    return newWords;
}

/**
 * Funktsioon kontrollimiseks kas mõni ankruruut on kasutatud (vajalik tavalise käigu jaoks)
 * row - Rea number
 * col - Veeru number
 * Tagastab kas mõni ankruruut on käigu jaoks kasutatud
 */
function checkUsedAnchorSquare(row, col) {
    var anchorSquares = findAllAnchorSquares();
    var find = anchorSquares.find((elem) => elem[0]==row && elem[1]==col);
    return find ? true : false;
}

/**
 * Funktsioon kontrollimiseks kas mõni ankruruut on kasutatud (vajalik tavalise käigu jaoks)
 * Tagastab kas mõni ankruruut on käigu jaoks kasutatud
 */
function checkUsedAnchorSquares() {
    var anchorSquares = findAllAnchorSquares();
    for (var lx in letterBoardIndexes) {
        var row = letterBoardIndexes[lx][0];
        var col = letterBoardIndexes[lx][1];
        var find;
        if (vertical) {
            find = anchorSquares.find((elem) => elem[0]==col && elem[1]==row);
        } else {
            find = anchorSquares.find((elem) => elem[0]==row && elem[1]==col);
        }
        if (find) return true;
    }
    return false;
}

/**
 * Funktsioon kontrollimiseks kas sõnas on tühikuid
 * Tagastab kas sõna on tühikuteta
 */
function checkMoveWithoutBreaks() {
    if (vertical) {
        for (var i = 1; i < letterBoardIndexes.length; i++) {
            var col = letterBoardIndexes[i][0];
            if (letterBoardIndexes[i][1] - letterBoardIndexes[i-1][1] != 1) {
                for (var j = letterBoardIndexes[i-1][1]+1; j < letterBoardIndexes[i][1]; j++) {
                    if (board[j][col] == '0') return false;
                }
            }
        }
    } else {
        for (var i = 1; i< letterBoardIndexes.length; i++) {
            var row = letterBoardIndexes[i][0];
            if (letterBoardIndexes[i][1] - letterBoardIndexes[i-1][1] != 1) {
                for (var j = letterBoardIndexes[i-1][1]+1; j < letterBoardIndexes[i][1]; j++) {
                    if (board[row][j] == '0') return false;
                }
            }
        }
    }
    return true;
}

/**
 * Funktsioon vertikaalse sõna leidmiseks
 * possibleWord - Leitud sõna
 * Tagastab sõna ja selle positsioon mängulaual
 */
function getVerticalMove(possibleWord) {
    var row = letterBoardIndexes[0][1];
    var col = letterBoardIndexes[0][0];
    var start;
    for (var i = row-1; i > -1; i--) {
        if (board[i][col] == '0') {
            start = i + 1;
            break;
        } else if (i == 0 && board[i][col] != '0') {
            start = 0;
            break;
        }
    }
    var end;
    var lastIndex = letterBoardIndexes[letterBoardIndexes.length-1][1];
    for (var i = lastIndex+1; i < 15; i++) {
        if (board[i][col] == '0') {
            end = i;
            break;
        } else if (i == 14 && board[i][col] != '0') {
            end = 15;
            break;
        }
    }
    var word = '';
    for (var i = start; i < row; i++) {
        word += board[i][col];
    }
    for (var i = 0; i < letterBoardIndexes.length; i++) {
        if (i-1 > -1 && letterBoardIndexes[i][1] - letterBoardIndexes[i-1][1] != 1) {
            for (var j = letterBoardIndexes[i-1][1]+1; j < letterBoardIndexes[i][1]; j++) {
                word += board[j][col];
            }
        }
        word += possibleWord[i];
    }
    for (var i = lastIndex+1; i < end; i++) {
        word += board[i][col];
    }
    return [word, col, start];
}

/**
 * Funktsioon horisontaalse sõna leidmiseks
 * possibleWord - Leitud sõna
 * Tagastab sõna ja selle positsioon mängulaual
 */
function getHorizontalMove(possibleWord) {
    var row = letterBoardIndexes[0][0];
    var col = letterBoardIndexes[0][1];
    var start;
    for (var i = col - 1; i > -1; i--) {
        if (board[row][i] == '0') {
            start = i + 1;
            break;
        } else if (i == 0 && board[row][i] != '0') {
            start = 0;
            break;
        }
    }
    var end;
    var lastIndex = letterBoardIndexes[letterBoardIndexes.length-1][1];
    for (var i = lastIndex + 1; i < 15; i++) {
        if (board[row][i] == '0') {
            end = i;
            break;
        } else if (i == 14 && board[row][i] != '0') {
            end = 15;
            break;
        }
    }
    var word = '';
    for (var i = start; i < col; i++) {
        word += board[row][i];
    }
    for (var i = 0; i < letterBoardIndexes.length; i++) {
        if (i-1 > -1 && letterBoardIndexes[i][1] - letterBoardIndexes[i-1][1] != 1) {
            for (var j = letterBoardIndexes[i-1][1]+1; j < letterBoardIndexes[i][1]; j++) {
                word += board[row][j];
            }
        }
        word += possibleWord[i];
    }
    for (var i = lastIndex+1; i < end; i++) {
        word += board[row][i];
    }
    return [word, row, start];
}
