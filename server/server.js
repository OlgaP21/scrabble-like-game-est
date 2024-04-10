const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const PORT = 8080;
const app = express();

var dictionaries = [];
fs.readdirSync(path.resolve(__dirname, 'public/dictionaries')).forEach(file => {
    dictionaries.push(file);
});

app.use(cors());

app.use('/letters/', express.static(path.resolve(__dirname, 'public/letters')));
app.use('/scores/', express.static(path.resolve(__dirname, 'public/scores')));
app.use('/tiles/', express.static(path.resolve(__dirname, 'public/tiles')));

app.use(express.static(path.resolve(__dirname, 'public')));

app.listen(PORT, () => {
    console.log('Server running!');
});

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.get('/dictionary.txt', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'dictionary.txt'));
});

for (var i = 1; i < dictionaries.length; i++) {
    var dictionary = dictionaries[i];
    app.get(`/${dictionaries[i]}`, (req, res) => {
        res.sendFile(path.resolve(__dirname, 'public/dictionaries', dictionary));
    });
};

app.get('/dictionaries', (req, res) => {
    res.send(dictionaries.join(' '));
});

app.post('/upload', async (req, res) => {
    req.on('data', async (chunk) => {
        var data = chunk.toString();
        var name = data.split('\n')[0];
        if (!dictionaryExists(name)) {
            var content = await checkDictionary(data);
            if (content.length == 0) return;
            var filename = path.resolve(__dirname, 'public/dictionaries/' + name);
            dictionaries.push(name.split('.')[0]);
            fs.writeFileSync(filename, content);
        }
    });
});

async function checkWord(word) {
    return await fetch(`https://www.filosoft.ee/html_morf_et/html_morf.cgi?doc=${encodeURIComponent(word)}`).then(res => res.text());
}

async function checkDictionary(data) {
    data = data.toLowerCase();
    var delimiters = [' ', '\n', ','];
    for (var dx in delimiters) {
        data = data.split(delimiters[dx]).join(' ');
    }
    var words = data.split(' ');
    var result = '';
    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var wordInfo = await checkWord(word);
        var legal = !wordInfo.includes('####') && (wordInfo.includes('sg&nbsp;n') || wordInfo.includes('pl&nbsp;n'));
        if (word.length < 16 && legal) {
            result += word + '\n';
        }
    }
    return result;
}

function dictionaryExists(name) {
    const dictionaryFolder = path.resolve(__dirname, 'public/dictionaries/');
    var files = fs.readdirSync(dictionaryFolder);
    for (var fx in files) {
        if (files[fx] == name) return true;
    }
    return false;
}
