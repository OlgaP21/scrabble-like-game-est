/**
 * Mängu reeglid jagatud osadeks
 */
const board = 'Mängulaud on 15x15 ruudustik, mis koosneb mitme tüübi ruutudest.\n- Valge - tavaline ruut.\n- Täht 2x - helesinine, kahekordistab selle asetatud täheklotsi punktid.\n- Täht 3x - tumesinine, kolmekordistab sellele asetatud täheklotsi punktid.\n- Sõna 2x - roosa, kahekordistab sõna punkid.\n- Sõna 3x - punane, kolmekordistab sõna punktid.';
const bag = 'Mängus on 102 täheklotsi. Igale klotsile on märgitud tähe väärtus.\nIgal tähel on kindel väärtus:\n- 0 punkti - jokker\n- 1 punkt - a, e, i, s, t, k, l, o, u\n- 2 punkti - d, m, n, r\n- 3 punkti - g, v\n- 4 punkti - h, j, p, õ, b\n- 5 punkti - ä, ü\n- 6 punkti - ö\n- 8 punkti - f\n- 10 punkti - š, z, ž';
const words = 'Kasutada saab käändsõnu (nimi-, omadus-, arv- ja asesõnad) ainsuse ja mitmuse nimetavas, pöördsõnu ma-tegevusnimena ning muutumatuid sõnu. Kasutada ei tohi pärisnimesid, lühendeid, ees- ja järelliiteid ning sõnu, mis kirjutatalse ülakoma või sidekriipsuga.';
const playing = 'Mängijal on käigu jaoks 3 võimalust:\n- mängulauale sõna ladumine;\n- käigu vahele jätmine;\n- täheklotside vahetamine.\n\nKäigu vahele jätmine\nMängija saab käigu vahele jätta ning sel juhul läheb käik üle arvutile.\n\nTäheklotside vahetamine\nMängija saab mõned või kõik enda täheklotsid välja vahetada. Seda saab teha kui kotis on klotse vähemalt seitse. Pärast klotside vahetamist läheb käik üle arvutile.\n\nSõna ladumine\nSõna mängulaule ladumiseks on 5 võimalust.\n1. Ühe või mitme täheklotsi lisamine juba laotud sõna algusesse ja/või lõppu.\n2. Sõna lisamine juba laotud sõnaga risti. Peab kasutama ühte juba laotud sõna tähte.\n3. Uue sõna lisamine juba laotud sõnaga paralleelselt. Kõik kõrvuti asetsevad täheklotsid peavad moodustama uued sõnad.\n4. Uus sõna võid lisada tähe juba laetud sõnale.\n5. Uus sõna võib kahe või enama sõna vahel silla luua. See saab juhtuda alates 4. käigust.\n\nEsimese sõna ladumine\nEsimene sõna moodustatakse kahest või enamast klotsist kas horisonaalselt või vertikaalselt, kusjuures üks klots tuleb panna keskmisele ruudule. Diagonaalis sõnade ladumine ei ole lubatud.\n\nMärkused:\n- Sama sõna võib mängu ajal mitu korda laduda.\n- Kõik lisatavad täheklotsid peavad moodustama pideva horisontaal- või vertikaalrea. Ei tohi ühe käigu jooksul sõnad mängulaua eri kohtades moodustada.\n';
const scoring = 'Käigu skoor saadakse, liites kokku sõna täheklotside punktid ning lisades neile preemiaruutudelt saadud punktid. Kui käigu ajal moodustatakse mitu sõna, arvutatakse iga sõna jaoks eraldi skoor. Lõppskoori saamiseks liidetakse kõikide sõnade skoorid kokku.\n\nKui sõna läbib nii tähe kui ka sõna preemiaruute, liidetakse esmalt kokku täheklotside punktid ning seejärel korrutatakse saaded punktisumma kahe või kolmega.\n\nKui mängija kasutab kõik 7 täheklotsi, siis liidetakse lõppskoorile 50 boonuspunkti.\n\nKui mängija on valinud temaatilist mängu, siis liidetakse temaatilise sõma kasutamine eest lõppskoorile punktide arvu, mis on võrdeline laotud sõna pikkusega.\n\n\nMärkused:\n- Preemiruutudelt saab punkte ainult selle käigu korral, mille ajal klotsid neile asetatakse.\n- Kui sõna läbib mitu preemiaruute, skoorimisel arvestatakse kõikide ruutudega.\n';
const end = 'Mäng lõppeb, kui:\n- kõik klotsid on kotist välja võetud ning üks mängijatest on kõik oma klotsid ära kasutanud;\n- mõlemad mängijad on 2 korda järjest käigu vahele jätnud.\n\n\nMängu lõppemisel muudetakse mängijate punktid:\n- iga mängija punktisummat vähendatakse tema kätte jäänud täheklotside punktide summa võrra\n- kui üks mängija on kõik oma klotsid ära ladunud, lisatakse tema punktisummale teise mängija kätte jäänud täheklotside punktide summa.';


/**
 * Mängu reeglite vaade
 */
export default class Rules extends Phaser.Scene {
    constructor() {
        super('Rules');
    }

    preload() {
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
    }

    create() {
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        
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
            .on('pointerout', () => this.backToMainMenuButton.setStyle({ fill: '#ffffff '}));
        
        var tabPages = createTabPages(this);
    }
}

/**
 * https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-tabpages/
 * Live demos, Tabpage
 * tabpages, CreateLabel, CreatePage - Lisatud rohkem külge, muudetud stiili
 */
var createTabPages = function(scene) {
    var tabPages = scene.rexUI.add.tabPages({
        x: scene.screenCenterX, y: 350,
        width: 900, height: 570,
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, 0x000000),
        tabs: { space: { item: 7 } },
        align: { tabs: 'left' },
        space: { left: 5, right: 5, top: 5, bottom: 5, item: 10 }
    });
    tabPages.on('tab.focus', function (tab, key) {
            tab.getElement('background').setStrokeStyle(2, 0xffd700);
        })
        .on('tab.blur', function (tab, key) {
            tab.getElement('background').setStrokeStyle();
        });
    tabPages
        .addPage({
            key: 'page0',
            tab: CreateLabel(scene, 'Mängulaud'),
            page: CreatePage(scene, board)
        })
        .addPage({
            key: 'page1',
            tab: CreateLabel(scene, 'Kott'),
            page: CreatePage(scene, bag)
        })
        .addPage({
            key: 'page2',
            tab: CreateLabel(scene, 'Lubatud sõnad'),
            page: CreatePage(scene, words)
        })
        .addPage({
            key: 'page3',
            tab: CreateLabel(scene, 'Mängimine'),
            page: CreatePage(scene, playing)
        })
        .addPage({
            key: 'page4',
            tab: CreateLabel(scene, 'Käigu skoorimine'),
            page: CreatePage(scene, scoring)
        })
        .addPage({
            key: 'page5',
            tab: CreateLabel(scene, 'Mängu lõpp'),
            page: CreatePage(scene, end)
        })
        .layout()
        .swapFirstPage();
    return tabPages;
}

var CreateLabel = function (scene, text) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, 0xffffff),
        text: scene.add.text(0, 0, text, {
            fontSize: 20,
            color: '#000000',
            strokeThickness: 0.75,
            stroke: '#000000'
        }),
        space: { left: 10, right: 10, top: 10, bottom: 10 }
    });
}

var CreatePage = function (scene, text) {
    return scene.rexUI.add.textArea({
        background: scene.rexUI.add.roundRectangle(0, 0, 900, 570, 13, 0xffffff),
        text: scene.add.text(0, 0, '', {
            fontSize: 24,
            color: '#000000',
            strokeThickness: 0.5,
            stroke: '#000000',
            padding: { left: 10, right: 10, bottom: 10, top: 20 },
            lineSpacing: 5
        }),
        slider: {
            track: scene.rexUI.add.roundRectangle(0, 0, 20, 0, 10, 0xb8b8b8),
            thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0x757575)
        },
        mouseWheelScroller: { speed: 0.25 },
        scroller: false,
        content: text
    });
}
