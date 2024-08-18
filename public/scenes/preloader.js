/**
 * Link failidele ligipääsu saamiseks
 */
const url = 'http://localhost:8080';


/**
 * Klass, kus toimub mängu failide laadimine, misjärel käivitatakse peamenüü vaadet
 */
export default class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        this.load.setPath(`${url}/letters/`);
        this.load.image('a_0', 'a.png');
        this.load.image('b_0', 'b.png');
        //this.load.image('c_0', 'c.png');
        this.load.image('d_0', 'd.png');
        this.load.image('e_0', 'e.png');
        this.load.image('f_0', 'f.png');
        this.load.image('g_0', 'g.png');
        this.load.image('h_0', 'h.png');
        this.load.image('i_0', 'i.png');
        this.load.image('j_0', 'j.png');
        this.load.image('k_0', 'k.png');
        this.load.image('l_0', 'l.png');
        this.load.image('m_0', 'm.png');
        this.load.image('n_0', 'n.png');
        this.load.image('o_0', 'o.png');
        this.load.image('p_0', 'p.png');
        //this.load.image('q_0', 'q.png');
        this.load.image('r_0', 'r.png');
        this.load.image('s_0', 's.png');
        this.load.image('š_0', 'š.png');
        this.load.image('z_0', 'z.png');
        this.load.image('ž_0', 'ž.png');
        this.load.image('t_0', 't.png');
        this.load.image('u_0', 'u.png');
        this.load.image('v_0', 'v.png');
        //this.load.image('w_0', 'w.png');
        this.load.image('õ_0', 'õ.png');
        this.load.image('ä_0', 'ä.png');
        this.load.image('ö_0', 'ö.png');
        this.load.image('ü_0', 'ü.png');
        //this.load.image('x_0', 'x.png');
        //this.load.image('y_0', 'y.png');
        this.load.image('blank', 'blank.png');

        this.load.setPath(`${url}/letters_scores/`);
        this.load.image('a', 'a.png');
        this.load.image('b', 'b.png');
        //this.load.image('c', 'c.png');
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
        //this.load.image('q', 'q.png');
        this.load.image('r', 'r.png');
        this.load.image('s', 's.png');
        this.load.image('š', 'š.png');
        this.load.image('z', 'z.png');
        this.load.image('ž', 'ž.png');
        this.load.image('t', 't.png');
        this.load.image('u', 'u.png');
        this.load.image('v', 'v.png');
        //this.load.image('w', 'w.png');
        this.load.image('õ', 'õ.png');
        this.load.image('ä', 'ä.png');
        this.load.image('ö', 'ö.png');
        this.load.image('ü', 'ü.png');
        //this.load.image('x', 'x.png');
        //this.load.image('y', 'y.png');
        this.load.image('?', 'blank.png');

        this.load.setPath(`${url}/tiles/`);
        this.load.image('white_tile', 'white_tile.png');
        this.load.image('red_tile', 'red_tile.png');
        this.load.image('blue_tile', 'blue_tile.png');
        this.load.image('pink_tile', 'pink_tile.png');
        this.load.image('lightblue_tile', 'lightblue_tile.png');
        this.load.image('star', 'star.png');
    }

    create() {
        this.scene.start('MainMenu');
    }
}
