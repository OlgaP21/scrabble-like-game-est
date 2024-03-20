export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;

        const style = {
            fontSize: '25px',
            backgroundColor: '#000000',
            color: '#ffffff',
            strokeThickness: 0.75,
            stroke: '#ffffff'
        };

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0x000000);
        this.graphics.strokeRect(0, 0, 920, 650);

        this.playComputerButton = this.add.text(screenCenterX, 255, 'Mängi arvutiga', style)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('GameOptions'))
            .on('pointerover', () => this.playComputerButton.setStyle({ fill: '#ffd700' }))
            .on('pointerout', () => this.playComputerButton.setStyle({ fill: '#ffffff'}))
            .setOrigin(0.5)
        ;
    
        this.rulesButton = this.add.text(screenCenterX, 320, 'Reeglid', style)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('Rules'))
            .on('pointerover', () => this.rulesButton.setStyle({ fill: '#ffd700' }))
            .on('pointerout', () => this.rulesButton.setStyle({ fill: '#ffffff'}))
            .setOrigin(0.5)
        ;
        
        this.optionsButton = this.add.text(screenCenterX, 385, 'Sõnastikud', style)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('Options'))
            .on('pointerover', () => this.optionsButton.setStyle({ fill: '#ffd700' }))
            .on('pointerout', () => this.optionsButton.setStyle({ fill: '#ffffff'}))
            .setOrigin(0.5)
        ;
    }
}
