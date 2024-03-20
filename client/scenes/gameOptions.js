const url = 'http://localhost:8080/dictionaries/';

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

        const style = {
            label: {
                space: { left: 10, right: 10, top: 10, bottom: 10 },
                background: {
                    color: 0x000000,
                },
                text: textStyle
            },
            button: {
                space: { left: 10, right: 10, top: 10, bottom: 10 },
                background: {
                    color: 0x000000,
                    'hover.strokeColor': 0xffd700,
                    'hover.strokeWidth': 2,
                },
                text: textStyle
            },
            list: {
                easeIn: 100,
                easeOut: 250
            }
        };

        var difficulty, theme;

        var options = ['Kerge', 'Keskmine', 'Raske'];
        var scene = this;

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0x000000);
        this.graphics.strokeRect(0, 0, 920, 650);
        
        this.backToMainMenuButton = this.add.text(5, 5, 'Tagasi peamenüüsse', textStyle)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('MainMenu'))
            .on('pointerover', () => this.backToMainMenuButton.setStyle({ fill: '#ddf700' }))
            .on('pointerout', () => this.backToMainMenuButton.setStyle({ fill: '#ffffff '}))
        ;

        /**
         * https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-simpledropdownlist/
         * Live demos, Drop-down list
         * Kood on võetud aluseks ja kohandatud
         */
        var difficultyDropDownList = this.rexUI.add.simpleDropDownList(style)
            .resetDisplayContent('Keerukus ▼')
            .setOptions(options)
            .setPosition(screenCenterX, 145)
            .layout()
            .on('button.click', (difficultyDropDownList, listPanel, button, index, pointer, event) => {
                difficultyDropDownList.setText(button.text)
                difficulty = button.text;
            })
            .setOrigin(0.5)
        ;

        var themeDropDownList = CreateDropDownList(this, screenCenterX, 345, 200, this.themeOptions).layout();
    
        this.playButton = this.add.text(screenCenterX, 600, 'Mängima!', textStyle)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', () => {
                difficulty = difficultyDropDownList.text;
                theme = themeDropDownList.text;
                if (difficulty == 'Keerukus ▼') {
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
            .setOrigin(0.5);
        ;
    }

    async getThemedOptions() {
        var request = await fetch(url);
        var data = await request.text();
        data = data.split(' ');
        for (var dx in data) {
            this.themeOptions.push(data[dx]);
        }
    }
}


/**
 * https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-scrollablepanel/
 * Live demos, Dropdown, scrollable list
 * Kood on võetud aluseks ja kohandatud
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
            list.scaleDownDestroy(100, 'y');
            list = undefined;
        });
        list.onClickOutside(function () {
            list.scaleDownDestroy(100, 'y');
            list = undefined;
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
        })
    ;
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
        stroke: '#ffffff'
    });
    return textObject;
}


/**
 * https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-dialog/
 * Live demos, Modal Dialog
 * Kood on võetud aluseks ja kohandatud
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
