import Preloader from "./scenes/preloader.js";
import MainMenu from "./scenes/mainMenu.js";
import Game from "./scenes/game.js";
import GameOptions from "./scenes/gameOptions.js";
import Rules from "./scenes/rules.js";
import Options from "./scenes/options.js";

const config = {
    type: Phaser.AUTO,
    width: 920,
    height: 650,
    backgroundColor: 0xffffff,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            }
        }
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Preloader,
        MainMenu,
        GameOptions,
        Game,
        Rules,
        Options
    ]
};

export default new Phaser.Game(config);
