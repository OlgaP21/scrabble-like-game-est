/**
 * Sõnastiku üles laadimise link
 */
const url = 'http://localhost:8080/upload';


/**
 * Kasutaja sõnastiku üles laadimise vaade
 */
export default class Options extends Phaser.Scene {
    constructor() {
        super('Options');
    }

    preload() {
        this.load.plugin('rexfilechooserplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexfilechooserplugin.min.js', true);
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
    }

    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const style = {
            fontSize: '25px',
            backgroundColor: '#000000',
            color: '#ffffff',
            strokeThickness: 0.75,
            stroke: '#ffffff'
        };

        const textStyle = {
            fontSize: '25px',
            color: '#000000',
            strokeThickness: 0.75,
            stroke: '#000000'
        };

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0x000000);
        this.graphics.strokeRect(0, 0, 920, 650);

        this.add.text(screenCenterX, 115, 'Siin saab oma temaatilise sõnastiku üles laadida', textStyle).setOrigin(0.5);
        this.add.text(screenCenterX, 155, 'Laetava faili formaat - .txt', textStyle).setOrigin(0.5);
        this.add.text(screenCenterX, 210, '   Failis võivad sõnad olla eraldatud kas \nkomaga, tühikuga või asuda igaüks omal real', textStyle).setOrigin(0.5);
        this.add.text(screenCenterX, 265, 'Laetava faili maksimaalne suururs - 1 kilobait', textStyle).setOrigin(0.5);
        this.add.text(screenCenterX, 315, 'Sõnad kontrollitakse Filosofti morfanalüsaatori abil', textStyle).setOrigin(0.5);
        this.add.text(screenCenterX, 365, 'Ebasobivad sõnad eemaldatakse', textStyle).setOrigin(0.5);

        var uploadText = this.add.text(screenCenterX, 460, '', textStyle).setOrigin(0.5);
        var scene = this;

        /**
         * https://rexrainbow.github.io/phaser3-rex-notes/docs/site/filechooser/
         * Live demos, Open file chooser dialog
         * uploadFileButton - lisatud laetud faili kontrollid
         */
        this.uploadFileButton = this.add.text(screenCenterX, 535, 'Vali sõnastiku fail', style)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', function() {
                scene.plugins.get('rexfilechooserplugin').open({ accept: '.txt' })
                    .then(function (result) {
                        var files = result.files;
                        if (files.length !== 0) {
                            var regex = /^[abcdefghijklmnopqrsšzžtuvwõäöüxy]+$/;
                            if (Math.round(files[0].size/1024) > 1) {
                                CreateDialog(scene, 'Fail on liiga suur')
                                    .setPosition(screenCenterX, screenCenterY)
                                    .layout()
                                    .modalPromise({
                                        manaulClose: true
                                    });
                            } else if (!regex.test(!files[0].name)) {
                                CreateDialog(scene, 'Faili nimi võib sisaldada ainult tähti')
                                    .setPosition(screenCenterX, screenCenterY)
                                    .layout()
                                    .modalPromise({
                                        manaulClose: true
                                    });
                            } else if (files[0].name.length > 19) {
                                CreateDialog(scene, 'Faili nimi on liiga pikk')
                                    .setPosition(screenCenterX, screenCenterY)
                                    .layout()
                                    .modalPromise({
                                        manaulClose: true
                                    });
                            } else {
                                uploadText.text = 'Faili valideerimine...';
                                var fileChooser = scene.add.rexFileChooser({ accept: '.txt' });
                                fileChooser.loadFilePromise(files[0], 'text', 'theme').then(function (content) {
                                    var data = files[0].name + '\n' + content;
                                    fetch(url, {
                                        body: data,
                                        method: 'POST',
                                        headers: {
                                            'content-type': 'text/plain'
                                        }
                                    }).then((result) => {
                                        result.text().then((message) => {
                                            uploadText.text = message;
                                        });
                                        setTimeout(() => {
                                            location.reload(true);
                                        }, 2500);
                                    });
                                });
                            }
                        } else {
                            CreateDialog(scene, 'Faili ei ole valitud')
                                .setPosition(screenCenterX, screenCenterY)
                                .layout()
                                .modalPromise({
                                    manaulClose: true
                                });
                        }
                    })
            })
            .on('pointerover', () => this.uploadFileButton.setStyle({ fill: '#ffd700' }))
            .on('pointerout', () => this.uploadFileButton.setStyle({ fill: '#ffffff'}))
            .setOrigin(0.5);

        this.backToMainMenuButton = this.add.text(5, 5, 'Tagasi peamenüüsse', style)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('MainMenu'))
            .on('pointerover', () => this.backToMainMenuButton.setStyle({ fill: '#ffd700' }))
            .on('pointerout', () => this.backToMainMenuButton.setStyle({ fill: '#ffffff'}));
    }
}


/**
 * https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-dialog/
 * Live demos, Modal Dialog
 * CreateDialog, CreateLabel - muudetud stiili
 */
var CreateDialog = function (scene, message) {
    var dialog = scene.rexUI.add.dialog({
        background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0xffffff),
        content: scene.add.text(0, 0, message, {
            fontSize: '25px',
            color: '#000000',
            strokeThickness: 0.75,
            stroke: '#000000'
        }),
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
