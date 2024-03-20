/**
 * https://en.wikipedia.org/wiki/Scrabble_letter_distributions
 * Scrabble letter distributions. Estonian
 * Tähtede jaotus ja väärtused on pärit eestikeelse Scrabble ametlikust väljaandest
 */

export var letters;
export var scores;
export var playerRack;
export var computerRack;

export function initBag() {
    letters = [
        '?', '?',
        'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 
        'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e',
        'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i',
        's', 's', 's', 's', 's', 's', 's', 's', 
        't', 't', 't', 't', 't', 't', 't', 
        'k', 'k', 'k', 'k', 'k', 
        'l', 'l', 'l', 'l', 'l', 
        'o', 'o', 'o', 'o', 'o', 
        'u', 'u', 'u', 'u', 'u', 
        'd', 'd', 'd', 'd', 
        'm', 'm', 'm', 'm', 
        'n', 'n', 'n', 'n', 
        'r', 'r', 
        'g', 'g', 
        'v', 'v', 
        'h', 'h', 
        'j', 'j', 
        'p', 'p', 
        'õ', 'õ', 
        'ä', 'ä', 
        'ü', 'ü', 
        'ö', 'ö', 
        'b', 'f', 'š', 'z', 'ž'
    ];
    scores = {
        '?': 0, 'a': 1, 'e': 1, 'i': 1, 's': 1, 't': 1, 'k': 1, 'l': 1, 'o': 1, 'u': 1,
        'd': 2, 'm': 2, 'n': 2, 'r': 2,
        'g': 3, 'v': 3,
        'h': 4, 'j': 4, 'p': 4, 'õ': 4, 'b': 4,
        'ä': 5, 'ü': 5,
        'ö': 6,
        'f': 8,
        'š': 10, 'z': 10, 'ž': 10
    };
    playerRack = ['a', 'b', 'd', 'e', 'g', 'f', 'j'];
    computerRack = ['a', 'b', 'd', 'e', 'g', 'f', 'j'];
    updatePlayerRack([]);
    updateComputerRack([]);
}

export function updatePlayerRack(usedLetters) {
    for (var lx in usedLetters) {
        if (usedLetters[lx] == usedLetters[lx].toUpperCase()) {
            playerRack.splice(playerRack.indexOf('?'), 1);
        } else {
            playerRack.splice(playerRack.indexOf(usedLetters[lx]), 1);
        }
    }
    while (playerRack.length != 7) {
        if (letters.length == 0) throw 21;
        var index = Math.floor(Math.random() * letters.length);
        playerRack.push(letters[index]);
        letters.splice(index, 1);
    }
}

export function updateComputerRack(usedLetters) {
    for (var lx in usedLetters) {
        computerRack.splice(computerRack.indexOf(usedLetters[lx]), 1);
    }
    while (computerRack.length != 7) {
        if (letters.length == 0) throw 22;
        var index = Math.floor(Math.random() * letters.length);
        computerRack.push(letters[index]);
        letters.splice(index, 1);
    }
}

export function changePlayerLetters(exchangeLetters) {
    if (letters.length < 7) throw 23;
    var oldLetters = [];
    for (var lx in exchangeLetters) {
        oldLetters.push(exchangeLetters[lx]);
        playerRack.splice(playerRack.indexOf(exchangeLetters[lx]), 1);
    }
    updatePlayerRack([]);
    for (var lx in oldLetters) {
        letters.push(oldLetters[lx]);
    }
}

export function changeComputerLetters() {
    if (letters.length < 7) throw 24;
    var oldLetters = [];
    for (var lx in computerRack) {
        oldLetters.push(computerRack[lx]);
    }
    computerRack = [];
    updateComputerRack([]);
    for (var lx in oldLetters) {
        letters.push(oldLetters[lx]);
    }
}
