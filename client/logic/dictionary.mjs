const url = 'http://localhost:8080/';

/**
 * https://albertauyeung.github.io/2020/06/15/python-trie.html
 * Albert Au Yeung, Implementing Trie in Python
 * Node - kirjutatud ümber JavaScript keeles
 * Trie - kirjutatud ümber JavaScript keeles; funktsioonid dfs ja query eemaldatud, funktsioon find lisatud
 */
class Node {
    constructor(letter) {
        this.letter = letter;
        this.isEnd = false;
        this.children = new Object();
    }
}

class Trie {
    constructor() {
        this.root = new Node('');
    }

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


export var dictionary;
export var themedDictionary;
export var theme;

export function initDictionary(chosenTheme) {
    dictionary = new Trie();
    themedDictionary = new Trie();
    theme = chosenTheme == 'teemata' ? null : chosenTheme;
    loadDictionary();
    if (theme) loadThemedDictionary(theme);
}

async function loadDictionary() {
    var request = await fetch(url + 'dictionary.txt');
    var text = await request.text();
    var lines = text.split('\n');
    for (var lx in lines) {
        dictionary.insert(lines[lx].trim());
    }
}

async function loadThemedDictionary(chosenTheme) {
    var response = await fetch(url + chosenTheme + '.txt');
    var text = await response.text();
    var lines = text.split('\n');
    for (var lx in lines) {
        themedDictionary.insert(lines[lx].trim());
    }
}
