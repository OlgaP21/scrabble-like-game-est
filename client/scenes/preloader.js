const url = 'http://localhost:8080';

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // letters
        this.load.setPath(`${url}/letters/`);
        this.load.image('a', 'a.png');
        this.load.image('b', 'b.png');
        this.load.image('c', 'c.png');
        this.load.image('d', 'd.png');
        this.load.image('e', 'e.png');
        this.load.image('f', 'f.png');
        this.load.image('g', 'g.png');
        this.load.image('h', 'h.png');
        this.load.image('i', 'i.png');
        this.load.image('j', 'j.png');
        this.load.image('k', 'k.png');
        this.load.image('l', 'l.png');
        this.load.image('m', 'm.png');
        this.load.image('n', 'n.png');
        this.load.image('o', 'o.png');
        this.load.image('p', 'p.png');
        this.load.image('q', 'q.png');
        this.load.image('r', 'r.png');
        this.load.image('s', 's.png');
        this.load.image('š', 'š.png');
        this.load.image('z', 'z.png');
        this.load.image('ž', 'ž.png');
        this.load.image('t', 't.png');
        this.load.image('u', 'u.png');
        this.load.image('v', 'v.png');
        this.load.image('w', 'w.png');
        this.load.image('õ', 'õ.png');
        this.load.image('ä', 'ä.png');
        this.load.image('ö', 'ö.png');
        this.load.image('ü', 'ü.png');
        this.load.image('x', 'x.png');
        this.load.image('y', 'y.png');
        this.load.image('?', 'blank.png');

        // scores
        this.load.setPath(`${url}/scores/`)
        //this.load.setPath('assets/scores');
        this.load.image('1', '1.png');
        this.load.image('2', '2.png');
        this.load.image('3', '3.png');
        this.load.image('4', '4.png');
        this.load.image('5', '5.png');
        this.load.image('6', '6.png');
        this.load.image('7', '7.png');
        this.load.image('8', '8.png');
        this.load.image('9', '9.png');
        this.load.image('0', '0.png');
        this.load.image('10', '10.png');

        // tiles
        this.load.setPath(`${url}/tiles/`);
        //this.load.setPath('assets/tiles');
        this.load.image('white_tile', 'white_tile.png');
        this.load.image('red_tile', 'red_tile.png');
        this.load.image('blue_tile', 'blue_tile.png');
        this.load.image('pink_tile', 'pink_tile.png');
        this.load.image('lightblue_tile', 'lightblue_tile.png');
    }

    create() {
        this.scene.start('MainMenu');
    }
}
