/**
 * Lingid failidele ligipääsu saamiseks
 */
const url = 'http://localhost:8080/';
const themedUrl = 'http://localhost:8080/dictionaries/';


/**
 * Mängu seadete vaade
 */
export default class GameOptions extends Phaser.Scene {
    constructor() {
        super('GameOptions');
        this.themeOptions = [];
        this.getThemedOptions();
    }

    preload() {
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
    }

    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const textStyle = {
            fontSize: '25px',
            backgroundColor: '#000000',
            color: '#ffffff',
            strokeThickness: 0.75,
            stroke: '#ffffff'
        };

        const difficultyTextStyle = {
            fontSize: '25px',
            backgroundColor: '#ffffff',
            color: '#000000',
            strokeThickness: 0.5,
            stroke: '#000000'
        };

        var difficulty = null;
        var theme = null;

        var scene = this;

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0x000000);
        this.graphics.strokeRect(0, 0, 920, 650);
        
        this.backToMainMenuButton = this.add.text(5, 5, 'Tagasi peamenüüsse', textStyle)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('MainMenu'))
            .on('pointerover', () => this.backToMainMenuButton.setStyle({ fill: '#ddf700' }))
            .on('pointerout', () => this.backToMainMenuButton.setStyle({ fill: '#ffffff '}));

        this.add.text(screenCenterX, 125, 'Vali mängu keerukus', difficultyTextStyle).setStroke('#000000', 1.5).setOrigin(0.5);

        this.easyGameButton = this.add.text(screenCenterX, 175, 'Kerge - Arvuti teeb väheskoorivaid käike', difficultyTextStyle)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', () => {
                scene.highlight(0);
                scene.difficulty = 0;
            })
            .setOrigin(0.5);

        this.mediumGameButton = this.add.text(screenCenterX, 220, 'Keskmine - Arvuti teeb juhuslikke käike', difficultyTextStyle)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', () => {
                scene.highlight(1);
                scene.difficulty = 1;
            })
            .setOrigin(0.5);

        this.hardGameButton = this.add.text(screenCenterX, 265, 'Raske - Arvuti teeb parimaid käike', difficultyTextStyle)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', () => {
                scene.highlight(2);
                scene.difficulty = 2
            })
            .setOrigin(0.5);

        var themeDropDownList = CreateDropDownList(this, 280, 345, 200, this.themeOptions).layout();

        this.dictionaryContent = CreateTextArea(this).layout();

        this.playButton = this.add.text(screenCenterX, 600, 'Mängima!', textStyle)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', () => {
                theme = themeDropDownList.text;
                if (scene.difficulty == null) {
                    CreateDialog(scene, 'Keerukus ei ole valitud')
                        .setPosition(screenCenterX, screenCenterY)
                        .layout()
                        .modalPromise({
                            manaulClose: true
                        })
                    ;
                } else if (theme == '      Teema     ▼') {
                    CreateDialog(scene, 'Teema ei ole valitud')
                        .setPosition(screenCenterX, screenCenterY)
                        .layout()
                        .modalPromise({
                            manaulClose: true
                        })
                    ;
                } else {
                    this.scene.start('Game', { difficulty: difficulty, theme: theme });
                }
            })
            .on('pointerover', () => this.playButton.setStyle({ fill: '#ddf700' }))
            .on('pointerout', () => this.playButton.setStyle({ fill: '#ffffff '}))
            .setOrigin(0.5);;
    }

    async getThemedOptions() {
        var request = await fetch(themedUrl);
        var data = await request.text();
        data = data.split(' ');
        for (var dx in data) {
            this.themeOptions.push(data[dx]);
        }
    }

    highlight(difficulty) {
        var baseColor = '#000000';
        var goldColor = '#ffd700';
        this.easyGameButton.setStyle({ color: baseColor });
        this.mediumGameButton.setStyle({ color: baseColor });
        this.hardGameButton.setStyle({ color: baseColor });
        if (difficulty == 0) {
            this.easyGameButton.setStyle({ color: goldColor });
        } else if (difficulty == 1) {
            this.mediumGameButton.setStyle({ color: goldColor });
        } else {
            this.hardGameButton.setStyle({ color: goldColor });
        }
    }

    async showDictionaryContent(theme) {
        if (theme == 'teemata') {
            var content = 'Baasõnastik:\n\n';
            var response = await fetch(`${url}dictionary.txt`);
            var text = await response.text();
            content += '- ' + text.split('\n').join('\n- ') + '\n';
            this.dictionaryContent.setText(content);
        } else {
            var content = 'Temaatilised\nsõnad:\n\n';
            var response = await fetch(`${themedUrl}${theme}.txt`);
            var text = await response.text();
            content += '- ' + text.split('\n').join('\n- ');
            this.dictionaryContent.setText(content);
        }
    }
}

/**
 * https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-textarea/
 * Add text-area object
 * CreateTextArea - muudetud stiili
 */
var CreateTextArea = function(scene) {
    return scene.rexUI.add.textArea({
        x: 630, y: 435,
        width: 300, height: 230,
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0x000000, 0.1),
        text: scene.add.text(0, 0, '', {
            fontSize: 24,
            color: '#000000',
            strokeThickness: 0.5,
            stroke: '#000000',
            padding: { left: 30, right: 10, bottom: 20, top: 20 },
            lineSpacing: 10
        }),
        slider: {
            track: scene.rexUI.add.roundRectangle(0, 0, 20, 0, 10, 0xb8b8b8),
            thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0x757575)
        },
        mouseWheelScroller: { speed: 0.25 },
        scroller: false,
        content: ''
    });
}

/**
 * https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-scrollablepanel/
 * Live demos, Dropdown, scrollable list
 * CreateDropDownList, CreatePopupList, CreateButton, CreateTextObject - muudetud stiili
 */
var CreateDropDownList = function (scene, x, y, menuHeight, options) {
    var label = scene.rexUI.add.label({
        x: x, y: y,
        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, '#ffffff'),
        text: CreateTextObject(scene, '      Teema     ▼').setFixedSize(260, 25),
        space: { left: 10, right: 10, top: 10, bottom: 10 }
    }).setData('value', '');
    label.data.events.on('changedata-value', function (parent, value, previousValue) {
        label.text = value;
    });
    var list;
    label.onClick(function () {
        if (list) {
            return;
        }
        var listX = label.getElement('text').getTopLeft().x;
        var listY = label.bottom;
        list = CreatePopupList(scene, listX, listY, menuHeight, options, function (button) {
            label.setData('value', button.text);
            scene.showDictionaryContent(button.text);
            list.scaleDownDestroy(100, 'y');
            list = undefined;
        });
        list.onClickOutside(function () {
            if (list != undefined) {
                list.scaleDownDestroy(100, 'y');
                list = undefined;
            }
        });
    });
    return label;
}

var CreatePopupList = function (scene, x, y, height, options, onClick) {
    var items = options.map(function (option) { return { label: option } });
    var buttonSizer = scene.rexUI.add.sizer({
        orientation: 'y'
    });
    for (var i = 0, cnt = items.length; i < cnt; i++) {
        buttonSizer.add(
            CreateButton(scene, items[i]),
            { expand: true }
        )
    }
    buttonSizer.layout();
    var list = scene.rexUI.add.scrollablePanel({
        x: x, y: y, width: 260, height: Math.min(height, buttonSizer.height),
        panel: { child: buttonSizer },
        slider: {
            track: scene.rexUI.add.roundRectangle({
                width: 20,
                radius: 10,
                color: 0xb8b8b8
            }),
            thumb: scene.rexUI.add.roundRectangle({
                radius: 13,
                color: 0x757575
            })
        },
        mouseWheelScroller: { speed: 0.25 },
        scroller: false
    }).setOrigin(0).layout();
    list
        .setChildrenInteractive({
            targets: [buttonSizer]
        })
        .on('child.click', function (child) {
            onClick(child);
        })
        .on('child.over', function (child) {
            child.getElement('background').setStrokeStyle(2, 0xffd700);
        })
        .on('child.out', function (child) {
            child.getElement('background').setStrokeStyle();
        });
    return list;
}

var CreateButton = function (scene, item) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, '#ffffff'),
        text: CreateTextObject(scene, item.label),
        space: { left: 10, right: 10, top: 10, bottom: 10 }
    });
}

var CreateTextObject = function (scene, text) {
    var textObject = scene.add.text(0, 0, text, {
        fontSize: '25px',
        backgroundColor: '#000000',
        color: '#ffffff',
        strokeThickness: 0.75,
        stroke: '#ffffff',
        align: 'center'
    });
    return textObject;
}


/**
 * https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-dialog/
 * Live demos, Modal Dialog
 * CreateDialog, CreateLabel - muudetud stiili
 */
var CreateDialog = function (scene, message) {
    var dialog = scene.rexUI.add.dialog({
        background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x000000),
        content: scene.add.text(0, 0, message, {
            fontSize: '25px',
            backgroundColor: '#000000',
            color: '#ffffff',
            strokeThickness: 0.75,
            stroke: '#ffffff'
        }),
        actions: [
            CreateLabel(scene, 'OK')
        ],
        space: { content: 25, action: 15, left: 20, right: 20, top: 20, bottom: 20 },
        align: { actions: 'center' },
        expand: { content: false }
    })
        .on('button.over', function (button, groupName, index, pointer, event) {
            button.getElement('text').setStyle({ fill: '#ffd700' });
        })
        .on('button.out', function (button, groupName, index, pointer, event) {
            button.getElement('text').setStyle({ fill: '#ffffff' });
        });
    return dialog;
}

var CreateLabel = function (scene, text) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x000000),
        text: scene.add.text(0, 0, text, {
            fontSize: '25px',
            backgroundColor: '#000000',
            color: '#ffffff',
            strokeThickness: 0.75,
            stroke: '#ffffff'
        }),
        space: { left: 10, right: 10, top: 10, bottom: 10 }
    });
}
