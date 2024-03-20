export default class Rules extends Phaser.Scene {
    constructor() {
        super('Rules');
    }

    create() {
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

        this.backToMainMenuButton = this.add.text(5, 5, 'Tagasi peamenüüsse', style)
            .setPadding(10)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('MainMenu'))
            .on('pointerover', () => this.backToMainMenuButton.setStyle({ fill: '#ffd700' }))
            .on('pointerout', () => this.backToMainMenuButton.setStyle({ fill: '#ffffff '}))
        ;
    }
}
