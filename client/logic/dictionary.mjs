/**
 * Fail, kus sisalduvad sõnastiku jaoks vajalikud klassid, muutujad ja funktsioonid
 * 
 * https://albertauyeung.github.io/2020/06/15/python-trie.html
 * Albert Au Yeung, Implementing Trie in Python
 * Node - kirjutatud ümber JavaScript keeles
 * Trie - kirjutatud ümber JavaScript keeles; funktsioonid dfs ja query eemaldatud, funktsioon find lisatud
 */


/**
 * Puu tipp
 */
class Node {
    constructor(letter) {
        this.letter = letter;
        this.isEnd = false;
        this.children = new Object();
    }
}

/**
 * Prefiksipuu
 */
class Trie {
    constructor() {
        this.root = new Node('');
    }

    /**
     * Funktsioon sõna lisamiseks
     * word - Lisatav sõna
     */
    insert(word) {
        var node = this.root;
        for (var lx in word) {
            var letter = word[lx];
            if (letter in node.children) {
                node = node.children[letter];
            } else {
                var child = new Node(letter);
                node.children[letter] = child;
                node = child;
            }
        }
        node.isEnd = true;
    }

    /**
     * Funktsioon sõna leidmise kontrollimiseks puust
     * word - Otsiatav sõna
     * Tagastab sõna olemasolu puus
     */
    find(word) {
        var node = this.root;
        for (var lx in word) {
            var letter = word[lx];
            if (letter in node.children) {
                node = node.children[letter];
            } else {
                return false;
            }
        }
        return node.isEnd;
    }
}

/**
 * Link failidele ligipääsu saamiseks
 */
const url = 'http://localhost:8080/';


/**
 * dicitonary - sõnastik
 * themedDictionary - temaatiline sõnastik
 * theme - teema
 */
export var dictionary;
export var themedDictionary;
export var theme;


/**
 * Funktsioon sõnastiku initsialiseerimiseks
 * chosenTheme - Valitud teema
 */
export function initDictionary(chosenTheme) {
    dictionary = new Trie();
    themedDictionary = new Trie();
    theme = chosenTheme == 'teemata' ? null : chosenTheme;
    loadDictionary();
    if (theme) loadThemedDictionary(theme);
}

/**
 * Funktsioon baasõnastiku mällu laadimiseks
 */
async function loadDictionary() {
    var request = await fetch(`${url}dictionary.txt`);
    var text = await request.text();
    var lines = text.split('\n');
    for (var lx in lines) {
        dictionary.insert(lines[lx].trim());
    }
}

/**
 * Funktsioon temaatilise sõnastiku mällu laadimiseks
 * chosenTheme - Valitud teema
 */
async function loadThemedDictionary(chosenTheme) {
    var response = await fetch(`${url}dictionaries/${chosenTheme}.txt`);
    var text = await response.text();
    var lines = text.split('\n');
    for (var lx in lines) {
        themedDictionary.insert(lines[lx].trim());
    }
}
