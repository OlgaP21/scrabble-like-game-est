import GameBoard from '../logic/gameboard.mjs';

import { scores, playerRack, computerRack, letters } from "../logic/bag.mjs";

import { makeFirstPlayerMove, makePlayerMove } from "../logic/player.mjs";
import { makeComputerMove, makeFirstComputerMove } from "../logic/algorithm.mjs";
import { initBag, changePlayerLetters } from '../logic/bag.mjs';
import { initBoard } from '../logic/board.mjs';
import { initDictionary } from '../logic/dictionary.mjs';


/**
 * Mängu vaade
 */
export default class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        this.playerScore = 0;
        this.computerScore = 0;

        this.playerRack = [];
        this.computerRack = [];

        this.firstMove = true;
    }

    init (data) {
        this.difficulty = data.difficulty;
        this.theme = data.theme;
    }

    preload() {
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
        this.load.plugin('rexanchorplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexanchorplugin.min.js', true);
    }

    create() {
        var scene = this;

        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.textStyle = {
            fontSize: '20px',
            color: '#000000',
            strokeThickness: 0.75,
            stroke: '#000000'
        };

        this.buttonStyle = {
            fontSize: '20px',
            backgroundColor: '#000000',
            color: '#ffffff',
            strokeThickness: 0.75,
            stroke: '#ffffff'
        };

        this.initGame();

        this.playerMoves = [];
        this.computerMoves = [];

        var board = new GameBoard();
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                var square = board.squares[i][j];
                this.physics.add.sprite(square.x, square.y, square.image);
            }
        }

        this.infoPanel = CreateInfoPanel(this);

        this.playerScoreText = this.add.text(10, 10, 'Mängija punktid: ', this.textStyle);
        this.computerScoreText = this.add.text(340, 10, 'Arvuti punktid: ', this.textStyle);

        this.skipButton = this.add.text(45, 550, 'Jäta käik vahele', this.buttonStyle)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', () => this.skipPlayerMove())
            .on('pointerover', () => this.skipButton.setStyle({ fill: '#ffd700' }))
            .on('pointerout', () => this.skipButton.setStyle({ fill: '#ffffff'}));

        this.changeLettersButton = this.add.text(264, 550, 'Vaheta tähed', this.buttonStyle)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', () => this.exchangePlayerLetters())
            .on('pointerover', () => this.changeLettersButton.setStyle({ fill: '#ffd700' }))
            .on('pointerout', () => this.changeLettersButton.setStyle({ fill: '#ffffff'}));

        this.readyButton = this.add.text(435, 550, 'Valmis', this.buttonStyle)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', () => this.playerMove(scene))
            .on('pointerover', () => this.readyButton.setStyle({ fill: '#ffd700' }))
            .on('pointerout', () => this.readyButton.setStyle({ fill: '#ffffff'}));

        this.exitButton = this.add.text(685, 550, 'Lõpeta mäng', this.buttonStyle)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('MainMenu'))
            .on('pointerover', () => this.exitButton.setStyle({ fill: '#ffd700' }))
            .on('pointerout', () => this.exitButton.setStyle({ fill: '#ffffff'}));

        this.input.on('dragstart', (pointer, gameObject) => {
            if (gameObject.data) {
                gameObject.data = '?';
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            dragX = Phaser.Math.Snap.To(dragX, 30);
            dragY = Phaser.Math.Snap.To(dragY, 30);
            if (dragX < 0) dragX = 0;
            else if (dragX > 480) dragX = 480;
            if (dragY < 60) dragY = 60;
            else if (dragY > 480) dragY = 480;
            gameObject.setPosition(dragX, dragY);
        });

        this.input.on('dragend', (pointer, gameObject) => {
            var x = gameObject.x;
            var y = gameObject.y;
            if (gameObject.data == '?' && x >= 60 && x <= 480 && y >= 60 && y <= 480) {
                var index = this.playerRack.indexOf(gameObject);
                createChooseBlankDialog(this, index);
            }
        });

        this.showPlayerRack();
        this.showComputerRack();
    }

    /**
     * Funktsioon mängu initsialiseerimiseks
     */
    initGame() {
        initBag();
        initBoard();
        initDictionary(this.theme);
    }

    /**
     * Funktsioon kasutaja käes olevate tähtede näitamiseks
     */
    showPlayerRack() {
        for (var i = 0; i < playerRack.length; i++) {
            var letter = playerRack[i];
            var l = this.add.image(15, 15, letter);
            var s = this.add.image(15, 15, scores[letter]);
            var container = this.add.container(0, i*60+60, [ l, s ]);
            container.setSize(40, 40);
            container.setInteractive({ draggable: true });
            if (letter == '?') container.data = '?';
            this.playerRack.push(container);
        }
        //this.physics.add.collider(this.playerRack);
    }

    /**
     * Funktsioon arvuti käes olevate klotside näitamiseks
     */
    showComputerRack() {
        for (var i = 0; i < computerRack.length; i++) {
            var letter = this.physics.add.sprite(555, i*60+75, '?');
            this.computerRack.push(letter);
        }
    }

    /**
     * Funktsioon mängija käigu sooritamiseks
     */
    playerMove(scene) {
        if (letters.length < 7) this.changeLettersButton.input.enabled = false;
        try {
            var result, usedLettersIndexes, score, createdWords;
            if (this.firstMove) {
                [usedLettersIndexes, score, createdWords] = makeFirstPlayerMove(this.playerRack);
                this.firstMove = false;
            } else {
                result = makePlayerMove(this.playerRack);
                [usedLettersIndexes, score, createdWords] = result.value;
            }
            if (result && result.error) {
                if (result.error == 21 || result.error == 23) {
                    this.changeLettersButton.input.enabled = false;
                } else {
                    throw result.error;
                }
            }
            this.playerScore += score;
            this.playerScoreText.text = 'Mängija punktid: ' + this.playerScore;
            for (var i = 0; i < this.playerRack.length; i++) {
                if (usedLettersIndexes.includes(i.toString())) {
                    this.playerRack[i].input.draggable = false;
                } else {
                    this.playerRack[i].destroy(true);
                }
            }
            var words = [];
            for (var wx in createdWords) {
                words.push(createdWords[wx][0]);
            }
            var message = `Mängija käik: ${words.join(', ')}\nPunkte kogutud ${score}`;
            this.updateInfoPanel(message);
            this.playerRack = [];
            this.showPlayerRack();
            this.playerMoves.push(0);
            this.checkGameEnd();
            this.computerMove();
        } catch (err) {
            console.log(err);
            CreateDialog(scene, err)
                .setPosition(this.screenCenterX, this.screenCenterY)
                .layout()
                .modalPromise({
                    manaulClose: true
                })
            ;
        }
    }

    /**
     * Funktsioon mängija käigu vahele jätmiseks
     */
    skipPlayerMove() {
        this.playerMoves.push(2);
        for (var i = 0; i < this.playerRack.length; i++) {
            this.playerRack[i].data = null;
            this.playerRack[i].destroy(true);
        }
        this.playerRack = [];
        this.updateInfoPanel('Mängija jätab käigu vahele');
        this.showPlayerRack();
        this.checkGameEnd();
        this.computerMove();
    }

    /**
     * Funktsioon mängija tähtede vahetamiseks
     */
    exchangePlayerLetters() {
        var dialog = CreateChangeLettersDialog(this);
    }

    /**
     * Funktsioon arvuti käigu sooritamiseks
     */
    computerMove() {
        if (letters.length < 7) this.changeLettersButton.input.enabled = false;
        var result, usedLetters, indexes, score, createdWords;
        if (this.firstMove) {
            result = makeFirstComputerMove(this.difficulty);
            if (!result.error || result.error == 22) {
                [usedLetters, indexes, score, createdWords] = result.value;
                this.firstMove = false;
            }
        } else {
            result = makeComputerMove(this.difficulty);
            if (!result.error || result.error == 22) {
                [usedLetters, indexes, score, createdWords] = result.value;
            }
        }
        if (result.error) {
            if (result.error == 22) {
                this.computerMoves.push(0);
                this.changeLettersButton.input.enabled = false;
            } else if (result.error == 24) {
                this.computerMoves.push(2);
                this.changeLettersButton.input.enabled = false;
                this.updateInfoPanel('Arvuti jätab käigu vahele');
                return;
            } else {
                this.computerMoves.push(1);
                this.updateInfoPanel('Arvuti vahetab tähed');
                return;
            }
        }
        this.computerScore += score;
        this.computerScoreText.text = 'Arvuti punktid: ' + this.computerScore;
        for (var i = 0; i < usedLetters.length; i++) {
            var letter = usedLetters[i];
            var l = this.add.image(0, 0, letter.toLowerCase());
            var s;
            if (letter == letter.toUpperCase()) {
                s = this.add.image(0, 0, '0');
            } else {
                s = this.add.image(0, 0, scores[letter]);
            }
            var container = this.add.container(indexes[i][0], indexes[i][1], [ l, s ]);
            container.setSize(30, 30);
        }
        for (var i = 0; i < this.computerRack.length; i++) {
            this.computerRack[i].destroy(true);
        }
        var words = [];
        for (var wx in createdWords) {
            words.push(createdWords[wx][0]);
        }
        var message = `Arvuti käik: ${words.join(', ')}\nPunkte kogutud ${score}`;
        this.updateInfoPanel(message);
        this.computerRack = [];
        this.showComputerRack();
        this.checkGameEnd();
    }

    /**
     * Funktsioon tehtud käikude info uuendamiseks
     */
    updateInfoPanel(message) {
        this.infoPanel.getElement('panel').add(CreatePanelChild(this, message));
        this.infoPanel.layout();
    }

    /**
     * Funktsioon kontrollimiseks kas mängu peab lõpetama
     */
    checkGameEnd() {
        if ((playerRack.length == 0 || computerRack.length == 0) && letters.length == 0) {
            this.endGame();
        } else if (this.playerMoves.length > 1 && this.computerMoves.length > 1) {
            var playerLastIndex = this.playerMoves.length - 1;
            var computerLastIndex = this.computerMoves.length - 1;
            var playerPenultMove = this.playerMoves[playerLastIndex-1];
            var playerLastMove = this.playerMoves[playerLastIndex];
            var computerPenultMove = this.computerMoves[computerLastIndex-1];
            var computerLastMove = this.computerMoves[computerLastIndex];
            if (playerPenultMove == 2 && playerLastMove == 2 && computerPenultMove == 2 && computerLastMove == 2) {
                this.endGame();
            }
        }
    }

    /**
     * Funktsioon mängu lõpetamiseks
     */
    endGame() {
        if (this.playerRack.length > 0 && this.computerRack.length > 0) {
            for (var lx in this.playerRack) {
                this.playerScore -= scores[this.playerRack[lx]];
            }
            for (var lx in this.computerRack) {
                this.computerScore -= scores[this.computerRack[lx]];
            }
        } else if (this.playerRack.length == 0) {
            for (var lx in this.computerRack) {
                this.playerScore += scores[this.computerRack[lx]];
                this.computerScore -= scores[this.computerRack[lx]];
            }
        } else {
            for (var lx in this.playerRack) {
                this.playerScore -= scores[this.playerRack[lx]];
                this.computerScore += scores[this.playerRack[lx]];
            }
        }
        CreateGameEndDialog(this)
            .setPosition(this.screenCenterX, this.screenCenterY)
            .layout()
            .modalPromise({
                manaulClose: true
            });
    }
}

/**
 * https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-scrollablepanel/?h=
 * Live demos, Scroll to child
 * CreateInfoPanel, CreatePanelChild - muudetud stiili
 */
var CreateInfoPanel = function (scene) {
    var panel = scene.rexUI.add.scrollablePanel({
        x: 760, y: 285,
        width: 280, height: 450,

        background: scene.rexUI.add.roundRectangle({ radius: 10, strokeColor: 0x000000, strokeWidth: 2 }),
        panel: {
            child: CreatePanelChild(scene, 'Esimesena käib mängija'),
        },
        slider: {
            track: scene.rexUI.add.roundRectangle({
                width: 20,
                radius: 13,
                color: 0xffffff
            }),
            thumb: scene.rexUI.add.roundRectangle({
                radius: 13,
                color: 0x000000
            }),
            input: -1,
        },
        mouseWheelScroller: {
            speed: 0.25
        },
        scroller: false,
    }).layout();
    return panel;
}

var CreatePanelChild = function (scene, message) {
    var panel = scene.rexUI.add.sizer({
        width: 280,
        orientation: 'y',
        space: { item: 7 }
    });
    var label = scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle({ radius: 10, color: 0xf2f2f2 }),
        text: scene.add.text(0, 0, message, {
            color: '#000000',
            strokeThickness: 0.75,
            stroke: '#000000',
            wordWrap: { width: 370 }
        }),
        space: { left: 10, right: 10, top: 10, bottom: 10 },
        name: message
    });
    panel.add(label, { expand: true });
    return panel;
}


/**
 * https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-dialog/
 * Live demos, Modal Dialog
 * CreateDialog - muudetud stiili
 */
var CreateDialog = function (scene, message) {
    var dialog = scene.rexUI.add.dialog({
        background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 10, 0xffffff),
        content: scene.add.text(0, 0, message, scene.textStyle),
        actions: [
            CreateLabel(scene, 'OK')
        ],
        space: { content: 25, action: 15, left: 20, right: 20, top: 20, bottom: 20 },
        align: { actions: 'center' },
        expand: { content: false }
    })
        .on('button.over', function (button, groupName, index, pointer, event) {
            button.getElement('text').setStyle({ fill: '#ffd700' })
        })
        .on('button.out', function (button, groupName, index, pointer, event) {
            button.getElement('text').setStyle({ fill: '#ffffff' })
        });
    return dialog;
}

var CreateLabel = function (scene, text) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x000000),
        text: scene.add.text(0, 0, text, scene.buttonStyle),
        space: { left: 10, right: 10, top: 10, bottom: 10 }
    });
}

/**
 * https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-confirmdialog/
 * Live demos, Radio-choices
 * CreateChangeLettersDialog - raadionuppude asemel märkeruudud, muudetud stiili, dialoogile lisatud valikud ja valikute kontrollid
 */
var CreateChangeLettersDialog = function (scene) {
    var choicesType = 'x-checkboxes';
    var style = {
        x: 0, y: 0,
        space: {
            left: 20, right: 20, top: 20, bottom: 20,
            content: 30, choices: 10, choice: 10, action: 15
        },
        background: {
            color: 0xffffff,
            radius: 20,
        },
        content: {
            space: { left: 5, right: 5, top: 5, bottom: 5 },
            text: scene.textStyle,
        },
        buttonMode: 1,
        button: {
            space: { left: 10, right: 10, top: 10, bottom: 10 },
            background: {
                color: 0x000000,
                strokeWidth: 0,
                radius: 10
            },
            text: { 
                fontSize: '20px',
                color: '#ffffff',
                strokeThickness: 0.75,
                stroke: '#ffffff',
                'hover.color': '#ddf700'
            }
        },
        choicesType: choicesType,
        choice: {
            space: { left: 10, right: 10, top: 10, bottom: 10 },
            background: {
                color: 0x000000,
                strokeWidth: 0.75,
                radius: 10,
                'hover.strokeColor': 0xffd700,
                'hover.strokeWidth': 2,
                'active.color': 0xffd700
            },
            text: {
                fontSize: '20px',
                color: '#ffffff',
                strokeThickness: 0.75,
                stroke: '#ffffff'
            }
        },
        align: { content: 'center', actions: 'center' }
    } 
    var dialog = scene.rexUI.add.confirmDialog(style)
        .setPosition(400, 300)
        .setDraggable('title')
        .resetDisplayContent({
            content: 'Vali vahetatavad tähed',
            choices: [
                { text: playerRack[0], value: 0 },
                { text: playerRack[1], value: 1 },
                { text: playerRack[2], value: 2 },
                { text: playerRack[3], value: 3 },
                { text: playerRack[4], value: 4 },
                { text: playerRack[5], value: 5 },
                { text: playerRack[6], value: 6 }
            ],
            buttonA: 'Ok'
        }).layout();
    dialog
        .modalPromise()
        .then(function (data) {
            var changeableLetters = [];
            for (var index in data.value) {
                if (data.value[index]) {
                    changeableLetters.push(playerRack[index]);
                }
            }
            if (changeableLetters.length > 0) {
                scene.playerMoves.push(1);
                changePlayerLetters(changeableLetters);
                for (var i = 0; i < scene.playerRack.length; i++) {
                    scene.playerRack[i].data = null;
                    scene.playerRack[i].destroy(true);
                }
                scene.playerRack = [];
                scene.updateInfoPanel('Mängija vahetab tähed');
                scene.showPlayerRack();
                scene.computerMove();
            }
        });
    scene.plugins.get('rexanchorplugin').add(dialog, {
        centerX: 'center'
    });
    return dialog;
}

/**
 * https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-confirmdialog/
 * Live demos, Radio-choices
 * createChooseBlankDialog - tavaliste raadionuppude asemel wrap raadionuppud, muudetud stiili, dialoogile lisatud valikud
 */
var createChooseBlankDialog = function (scene, index) {
    var choicesType = 'wrap-radio';
    var style = {
        x: 0, y: 0,
        width: 335,
        space: {
            left: 20, right: 20, top: 20, bottom: 20,
            content: 30, choices: 10, choice: 10, action: 15
        },
        background: {
            color: 0xffffff,
            radius: 20,
        },
        content: {
            space: { left: 5, right: 5, top: 5, bottom: 5 },
            text: scene.textStyle,
        },
        buttonMode: 1,
        button: {
            space: { left: 10, right: 10, top: 10, bottom: 10 },
            background: {
                color: 0x000000,
                strokeWidth: 0,
                radius: 10,
                'disable.color': 0x595959,
            },
            text: { 
                fontSize: '20px',
                color: '#ffffff',
                strokeThickness: 0.75,
                stroke: '#ffffff',
                'hover.color': '#ddf700'
            }
        },
        choicesType: choicesType,
        choice: {
            space: { left: 10, right: 10, top: 10, bottom: 10 },
            background: {
                color: 0x000000,
                strokeWidth: 0.75,
                radius: 10,
                'hover.strokeColor': 0xffd700,
                'hover.strokeWidth': 2,
                'active.color': 0xffd700
            },
            text: {
                fontSize: '20px',
                color: '#ffffff',
                strokeThickness: 0.75,
                stroke: '#ffffff'
            }
        },
        expand: { content: false },
        align: { content: 'center', actions: 'center' }
    } 
    var dialog = scene.rexUI.add.confirmDialog(style)
        .setPosition(400, 300)
        .setDraggable('title')
        .resetDisplayContent({
            content: 'Vali täht',
            choices: [
                { text: 'a', value: 'A' }, { text: 'b', value: 'B' }, { text: 'd', value: 'D' },
                { text: 'e', value: 'E' }, { text: 'f', value: 'F' }, { text: 'g', value: 'G' },
                { text: 'h', value: 'H' }, { text: 'i', value: 'I' }, { text: 'j', value: 'J' },
                { text: 'k', value: 'K' }, { text: 'l', value: 'L' }, { text: 'm', value: 'M' }, 
                { text: 'n', value: 'N' }, { text: 'o', value: 'O' }, { text: 'p', value: 'P' },
                { text: 'r', value: 'R' }, { text: 's', value: 'S' }, { text: 'š', value: 'Š' }, 
                { text: 'z', value: 'Z' }, { text: 'ž', value: 'Ž' }, { text: 't', value: 'T' }, 
                { text: 'u', value: 'U' }, { text: 'v', value: 'V' }, { text: 'õ', value: 'Õ' }, 
                { text: 'ä', value: 'Ä' }, { text: 'ö', value: 'Ö' }, { text: 'ü', value: 'Ü' }
            ],
            buttonA: 'Ok'
        }).layout();
    dialog
        .setActionEnable(0, false)
        .once('choice.click', function () {
            this.setActionEnable(0);
        });
    dialog
        .modalPromise()
        .then(function (data) {
            scene.playerRack[index].data = data.value;
            scene.playerRack[index].list[0].setTexture(data.value.toLowerCase());
        });
    scene.plugins.get('rexanchorplugin').add(dialog, {
        centerX: 'center'
    });
    return dialog;
}

/**
 * https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-dialog/
 * Live demos, Modal Dialog
 * CreateGameEndDialog - muudetud stiili
 */
var CreateGameEndDialog = function(scene) {
    var message = `Mängija punktid: ${scene.playerScore} \nArvuti punktid: ${scene.computerScore}`;
    var dialog = scene.rexUI.add.dialog({
        background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 10, 0xffffff),
        content: scene.add.text(0, 0, message, scene.textStyle),
        actions: [
            CreateLabel(scene, 'Mängi uuesti'),
            CreateLabel(scene, 'Tagasi peamenüüsse')
        ],
        space: { content: 25, action: 15, left: 20, right: 20, top: 20, bottom: 20 },
        align: { actions: 'center' },
        expand: { content: false }
    })
        .on('button.over', function (button, groupName, index, pointer, event) {
            button.getElement('text').setStyle({ fill: '#ffd700' })
        })
        .on('button.click', function (button, groupName, index, pointer, event) {
            if (index == 0) {
                scene.scene.start('GameOptions');
            } else {
                scene.scene.start('MainMenu');
            }
        })
        .on('button.out', function (button, groupName, index, pointer, event) {
            button.getElement('text').setStyle({ fill: '#ffffff' })
        });
    return dialog;
}
