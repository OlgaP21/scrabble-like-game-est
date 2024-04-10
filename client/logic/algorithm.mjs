/**
 * Fail, kus sisalduvad arvuti käigu jaoks vajalikud muutujad ja funktsioonid
 * 
 * https://www.cs.cmu.edu/afs/cs/academic/class/15451-s06/www/lectures/scrabble.pdf
 * Andrew W. Appel and Guy J. Jacobson, The World's Fastest Scrabble Program
 * Funktsioonid leftPart, extendRight, legalMove põhinevad eelmainitud töös kirjeldatud algoritmil
 * - leftPart - paremale pikendamine alustatakse mitte funktsioonile argumendina antud ankruruudul, vaid järgmisel ankruruudul
 * - extendRight - ankruruudu ristkontrolli hulga kontroll on eemaldatud
 * - legalMove - lisaks parima käigu salvestamisele, teostatakse funktsioonis kontrolli kas käik sobib leitud positsioonile
 */


import { scores, computerRack } from "./bag.mjs";
import { board, multipliers, horizontalWords, verticalWords, transposed } from "./board.mjs";
import { dictionary, themedDictionary, theme } from "./dictionary.mjs";

import { updateComputerRack, changeComputerLetters } from "./bag.mjs";
import { transpose, findAnchorSquares, updateBoard } from "./board.mjs";


/**
 * move - parim leitud käik
 * createdWords - käiguga tekitatud sõnad
 * bestScore - parima käigu skoor
 * firstMove - kas on esimene käik või tavaline
 * difficulty - kasutaja valitud mängu keerukus
 */
var move;
var createdWords;
var bestScore;
var firstMove = true;
var difficulty;


/**
 * Funktsioon arvutiseisu tühistamiseks enne uut käiku
 */
function reset() {
    move = [];
    createdWords = [];
    if (difficulty == 0) {
        bestScore = 1000;
    } else {
        bestScore = 0;
    }
}

/**
 * Funktsioon esimese käigu sooritamiseks
 * gameDifficulty - Mängu keerukus = Arvuti mängu tase
 * Tagastab kasutatud tähed, tähtede asukohad mängulaual, käigu skoor, loodud sõnad, veateade
 */
export function makeFirstComputerMove(gameDifficulty) {
    difficulty = gameDifficulty;
    reset();
    var err;
    try {
        leftPart('', dictionary.root, [7, 7, 7]);
        var [usedLetters, indexes] = updateComputerState();
        if (usedLetters.length == 7) bestScore += 50;
        updateComputerRack(usedLetters);
    } catch (e) {
        if (e == 22) {
            err = e;
        } else {
            try {
                changeComputerLetters();
                err = 'ok';
            } catch (e1) {
                err = e1;
            }
        }
    } finally {
        if (board[7][7] != '0') firstMove = false;
        return {
            value: [usedLetters, indexes, bestScore, createdWords],
            error: err
        }
    }
}

/**
 * Funktsioon tavalise käigu sooritamiseks
 * gameDifficulty - Mängu keerukus = Arvuti mängu tase
 * Tagastab kasutatud tähed, tähtede asukohad mängulaual, käigu skoor, loodud sõnad, veateade
 */
export function makeComputerMove(gameDifficulty) {
    difficulty = gameDifficulty;
    reset();
    var err;
    try {
        var anchorSquares = findAnchorSquares();
        for (var ax in anchorSquares) {
            leftPart('', dictionary.root, anchorSquares[ax]);
        }
        transpose();
        anchorSquares = findAnchorSquares();
        for (var ax in anchorSquares) {
            leftPart('', dictionary.root, anchorSquares[ax]);
        }
        transpose();
        var [usedLetters, indexes] = updateComputerState();
        if (usedLetters.length == 7) bestScore += 50;
        updateComputerRack(usedLetters);
    } catch (e) {
        if (e == 22) {
            err = e;
        } else {
            try {
                changeComputerLetters();
                err = 'ok';
            } catch (e1) {
                err = e1;
            }
        }
    } finally {
        return {
            value: [usedLetters, indexes, bestScore, createdWords],
            error: err
        }
    }
}

/**
 * Funktsioon sõna vasaku poole leidmiseks
 * partialWord - Osaline sõna
 * node - Sõnastiku tipp
 * Tagastab ankruruudu (selle positsioon ja vabade ruutude arv ankruruuduni)
 */
function leftPart(partialWord, node, anchor) {
    var [row, col, limit] = anchor;
    extendRight(partialWord, node, [row, col+1]);
    if (limit > 0) {
        for (var letter in node.children) {
            if (computerRack.includes(letter)) {
                computerRack.splice(computerRack.indexOf(letter), 1);
                leftPart(partialWord+letter, node.children[letter], [row, col, limit-1]);
                computerRack.push(letter);
            } else if (computerRack.includes('?')) {
                computerRack.splice(computerRack.indexOf('?'), 1);
                leftPart(partialWord+letter.toUpperCase(), node.children[letter], [row, col, limit-1]);
                computerRack.push('?');
            }
        }
    }
}

/**
 * Funktsioon sõna paremale pikendamiseks
 * partialWord - Osaline sõna
 * node - Sõnastiku tipp
 * square - Ruut mängulaual (selle positsioon)
 */
function extendRight(partialWord, node, square) {
    var [row, col] = square;
    if (board[row][col] == '0' || row == 15 || col == 15) {
        if (node.isEnd) {
            legalMove(partialWord, row, col-partialWord.length);
        }
        for (var letter in node.children) {
            if (computerRack.includes(letter)) {
                computerRack.splice(computerRack.indexOf(letter), 1);
                extendRight(partialWord+letter, node.children[letter], [row, col+1]);
                computerRack.push(letter);
            } else if (computerRack.includes('?')) {
                computerRack.splice(computerRack.indexOf('?'), 1);
                extendRight(partialWord+letter.toUpperCase(), node.children[letter], [row, col+1]);
                computerRack.push('?');
            }
        }
    } else {
        var squareLetter = board[row][col];
        if (squareLetter in node.children) {
            extendRight(partialWord+squareLetter, node.children[squareLetter], [row, col+1]);
        }
    }
}

/**
 * Funktsioon leitud käigu kontrollimiseks ning parima käigu salvestamiseks
 * word - Leitud sõna
 * row - Rea number
 * col - Veeru number
 */
function legalMove(word, row, col) {
    if (!checkMove(word.toLowerCase(), row, col)) return;
    if (!checkWord(word.toLowerCase(), row, col)) return;
    if (firstMove && !checkUsedCentralSquare(word, col)) return;
    var newWords = findNewWords(word, row, col, transposed);
    var score = scoreMove(newWords);
    if (difficulty == 0) {
        if (verticalWords.length > 5 && horizontalWords.length > 5 && score < bestScore || score > 5) {
            move = [word, row, col, transposed];
            bestScore = score;
            createdWords = newWords;
        }
    } else if (difficulty == 1) {
        move = [word, row, col, transposed];
        bestScore = score;
        createdWords = newWords;
    } else {
        if (score > bestScore) {
            move = [word, row, col, transposed];
            bestScore = score;
            createdWords = newWords;
        }
    }
}

/**
 * Funktsioon käigu ajal tekitatud sõnade olemasolu kontrollimiseks sõnastikust
 * possibleWord - Leitud sõna
 * row - Rea number
 * col - Veeru number
 * Tagastab sõna olemasolu sõnastikus (tavalises või temaatilises)
 */
function checkMove(possibleWord, row, col) {
    for (var j = col; j < col+possibleWord.length; j++) {
        var word = '';
        for (var i = 0; i < 15; i++) {
            var boardLetter = board[i][j];
            if (i == row) boardLetter = possibleWord[j-col];
            if (boardLetter == '0' && word.length == 1) {
                word = '';
            } else if (boardLetter == '0' && word.length > 1) {
                if (theme && !themedDictionary.find(word) || !dictionary.find(word)) return false;
                word = '';
            } else if (boardLetter != '0') {
                word += boardLetter;
            }
        }
        if (word != '' && (theme && !themedDictionary.find(word) || !dictionary.find(word))) {
            return false;
        }
    }
    var word = '';
    for (var j = 0; j < 15; j++) {
        var boardLetter = board[row][j];
        if (j >= col && j < col+possibleWord.length) boardLetter = possibleWord[j-col];
        if (boardLetter == '0' && word.length == 1) {
            word = '';
        } else if (boardLetter == '0' && word.length > 1) {
            if (theme && !themedDictionary.find(word) || !dictionary.find(word)) return false;
            word = '';
        } else if (boardLetter != '0') {
            word += boardLetter;
        }
    }
    if (word != '' && (theme && !themedDictionary.find(word) || !dictionary.find(word))) return false;
    return true;
}

/**
 * Funktsioon kontrollimiseks kas leitud käik langeb juba mõne varem tehtud käiguga kokku
 * word - Leitud sõna
 * row - Rea number
 * col - Veeru number
 * vertical - Mängulaua seis (transponeeritud või mitte)
 * Tagastab käigu olemasolu varasemate käikude hulgas
 */
function checkWord(word, row, col, vertical=transposed) {
    var find;
    if (vertical) {
        find = verticalWords.find((elem) => elem[0]==word && elem[1]==row && elem[2]==col);
    } else {
        find = horizontalWords.find((elem) => elem[0]==word && elem[1]==row && elem[2]==col);
    }
    if (find) return false;
    return true;
}

/**
 * Funktsioon kontrollimiseks kas keskruut on kasutatud (vajalik esimese käigu jaoks)
 * word - Leitud sõna
 * col - Veeru number
 * Tagastab tõeväärtuse kas keskruutu on käigu tegemiseks kasutatud
 */
function checkUsedCentralSquare(word, col) {
    for (var i = col; i < col+word.length; i++) {
        if (i == 7) return true;
    }
    return false;
}

/**
 * Funktsioon käiguga tekitatud uute sõnade leidmiseks
 * possibleWord - Leitud sõna
 * row - Rea number
 * col - Veeru number
 * vertical - Mängulaua seis (transponeeritud või mitte)
 * Tagastab kõik käiguga tekitatud uued sõnad
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
        if (vertical) boardCopy[j][row] = possibleWord[j-col]
        else boardCopy[row][j] = possibleWord[j-col];
    }
    var newWords = [];
    for (var i = 0; i < 15; i++) {
        var word = '';
        for (var j = 0; j < 15; j++) {
            var boardLetter = boardCopy[i][j];
            if (boardLetter == '0' && word.length == 1) {
                word = '';
            } else if (boardLetter == '0' && word.length > 1) {
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
 * Funktsioon käigu skoorimiseks
 * newWords - Käiguga tekitatud sõnad
 * Tagastab käigu skoori (siin ei arvestata 50 boonuspunkti)
 */
function scoreMove(newWords) {
    var totalScore = 0;
    for (var wx in newWords) {
        var [word, row, col, vertical] = newWords[wx];
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
            if (letter != letter.toUpperCase()) score += scores[letter]*letterMultiplier;
        }
        score *= wordMultiplier;
        if (theme && themedDictionary.find(word)) {
            score += word.length;
        }
        totalScore += score;
    }
    return totalScore;
}

/**
 * Funktsioon arvuti seisundi uuendamiseks
 * Tagastab asutatud tähed, tähtede asukohad mängulaual
 */
function updateComputerState() {
    for (var wx in createdWords) {
        var [word, row, col, vertical] = createdWords[wx];
        if (vertical) verticalWords.push([word.toLowerCase(), row, col]);
        else horizontalWords.push([word.toLowerCase(), row, col]);
    }
    var usedLetters = [];
    var indexes = [];
    var [word, row, col, vertical] = move;
    for (var j = col; j < col+word.length; j++) {
        if (vertical) {
            if (multipliers[j][row] != '0') {
                usedLetters.push(word[j-col]);
                var r = row * 30 + 75;
                var c = j * 30 + 75;
                indexes.push([r, c]);
            }
        } else {
            if (multipliers[row][j] != '0') {
                usedLetters.push(word[j-col]);
                var r = j * 30 + 75;
                var c = row * 30 + 75;
                indexes.push([r, c]);
            }
        }
    }
    updateBoard(move);
    return [usedLetters, indexes];
}
