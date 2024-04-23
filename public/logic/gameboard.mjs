/**
 * Funktsioon, kus sisalduvad mängulaua mängijale esitamiseks vajalikud klassid
 * 
 * https://en.wikipedia.org/wiki/Scrabble
 * Scrabble. Game details
 * GameBoard - ametlik Scrabble'i mängulaua disain
 */

/**
 * Mängulaua ruut
 */
class Square {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
    }
}

/**
 * Mängulaud
 */
export default class GameBoard {
    constructor() {
        this.squares = [
            [
                new Square(75, 75, 'red_tile'), 
                new Square(105, 75, 'white_tile'), 
                new Square(135, 75, 'white_tile'), 
                new Square(165, 75, 'lightblue_tile'), 
                new Square(195, 75, 'white_tile'), 
                new Square(225, 75, 'white_tile'), 
                new Square(255, 75, 'white_tile'), 
                new Square(285, 75, 'red_tile'), 
                new Square(315, 75, 'white_tile'), 
                new Square(345, 75, 'white_tile'), 
                new Square(375, 75, 'white_tile'), 
                new Square(405, 75, 'lightblue_tile'), 
                new Square(435, 75, 'white_tile'), 
                new Square(465, 75, 'white_tile'), 
                new Square(495, 75, 'red_tile')
            ], 
            [
                new Square(75, 105, 'white_tile'), 
                new Square(105, 105, 'pink_tile'), 
                new Square(135, 105, 'white_tile'), 
                new Square(165, 105, 'white_tile'), 
                new Square(195, 105, 'white_tile'), 
                new Square(225, 105, 'blue_tile'), 
                new Square(255, 105, 'white_tile'), 
                new Square(285, 105, 'white_tile'), 
                new Square(315, 105, 'white_tile'), 
                new Square(345, 105, 'blue_tile'), 
                new Square(375, 105, 'white_tile'), 
                new Square(405, 105, 'white_tile'), 
                new Square(435, 105, 'white_tile'), 
                new Square(465, 105, 'pink_tile'), 
                new Square(495, 105, 'white_tile')
            ],
            [
                new Square(75, 135, 'white_tile'), 
                new Square(105, 135, 'white_tile'), 
                new Square(135, 135, 'pink_tile'), 
                new Square(165, 135, 'white_tile'), 
                new Square(195, 135, 'white_tile'), 
                new Square(225, 135, 'white_tile'), 
                new Square(255, 135, 'lightblue_tile'), 
                new Square(285, 135, 'white_tile'), 
                new Square(315, 135, 'lightblue_tile'), 
                new Square(345, 135, 'white_tile'), 
                new Square(375, 135, 'white_tile'), 
                new Square(405, 135, 'white_tile'), 
                new Square(435, 135, 'pink_tile'), 
                new Square(465, 135, 'white_tile'), 
                new Square(495, 135, 'white_tile')
            ], 
            [
                new Square(75, 165, 'lightblue_tile'), 
                new Square(105, 165, 'white_tile'), 
                new Square(135, 165, 'white_tile'), 
                new Square(165, 165, 'pink_tile'), 
                new Square(195, 165, 'white_tile'), 
                new Square(225, 165, 'white_tile'), 
                new Square(255, 165, 'white_tile'), 
                new Square(285, 165, 'lightblue_tile'), 
                new Square(315, 165, 'white_tile'), 
                new Square(345, 165, 'white_tile'), 
                new Square(375, 165, 'white_tile'), 
                new Square(405, 165, 'pink_tile'), 
                new Square(435, 165, 'white_tile'), 
                new Square(465, 165, 'white_tile'), 
                new Square(495, 165, 'lightblue_tile')
            ], 
            [
                new Square(75, 195, 'white_tile'), 
                new Square(105, 195, 'white_tile'), 
                new Square(135, 195, 'white_tile'), 
                new Square(165, 195, 'white_tile'), 
                new Square(195, 195, 'pink_tile'), 
                new Square(225, 195, 'white_tile'), 
                new Square(255, 195, 'white_tile'), 
                new Square(285, 195, 'white_tile'), 
                new Square(315, 195, 'white_tile'), 
                new Square(345, 195, 'white_tile'), 
                new Square(375, 195, 'pink_tile'), 
                new Square(405, 195, 'white_tile'), 
                new Square(435, 195, 'white_tile'), 
                new Square(465, 195, 'white_tile'), 
                new Square(495, 195, 'white_tile')
            ], 
            [
                new Square(75, 225, 'white_tile'), 
                new Square(105, 225, 'blue_tile'), 
                new Square(135, 225, 'white_tile'), 
                new Square(165, 225, 'white_tile'), 
                new Square(195, 225, 'white_tile'), 
                new Square(225, 225, 'blue_tile'), 
                new Square(255, 225, 'white_tile'), 
                new Square(285, 225, 'white_tile'), 
                new Square(315, 225, 'white_tile'), 
                new Square(345, 225, 'blue_tile'), 
                new Square(375, 225, 'white_tile'), 
                new Square(405, 225, 'white_tile'), 
                new Square(435, 225, 'white_tile'), 
                new Square(465, 225, 'blue_tile'), 
                new Square(495, 225, 'white_tile')
            ], 
            [
                new Square(75, 255, 'white_tile'), 
                new Square(105, 255, 'white_tile'), 
                new Square(135, 255, 'lightblue_tile'), 
                new Square(165, 255, 'white_tile'), 
                new Square(195, 255, 'white_tile'), 
                new Square(225, 255, 'white_tile'), 
                new Square(255, 255, 'lightblue_tile'), 
                new Square(285, 255, 'white_tile'), 
                new Square(315, 255, 'lightblue_tile'), 
                new Square(345, 255, 'white_tile'), 
                new Square(375, 255, 'white_tile'), 
                new Square(405, 255, 'white_tile'), 
                new Square(435, 255, 'lightblue_tile'), 
                new Square(465, 255, 'white_tile'), 
                new Square(495, 255, 'white_tile')
            ], 
            [
                new Square(75, 285, 'red_tile'), 
                new Square(105, 285, 'white_tile'), 
                new Square(135, 285, 'white_tile'), 
                new Square(165, 285, 'lightblue_tile'), 
                new Square(195, 285, 'white_tile'), 
                new Square(225, 285, 'white_tile'), 
                new Square(255, 285, 'white_tile'), 
                new Square(285, 285, 'star'), 
                new Square(315, 285, 'white_tile'), 
                new Square(345, 285, 'white_tile'), 
                new Square(375, 285, 'white_tile'), 
                new Square(405, 285, 'lightblue_tile'), 
                new Square(435, 285, 'white_tile'), 
                new Square(465, 285, 'white_tile'), 
                new Square(495, 285, 'red_tile')
            ],
            [
                new Square(75, 315, 'white_tile'), 
                new Square(105, 315, 'white_tile'), 
                new Square(135, 315, 'lightblue_tile'), 
                new Square(165, 315, 'white_tile'), 
                new Square(195, 315, 'white_tile'), 
                new Square(225, 315, 'white_tile'), 
                new Square(255, 315, 'lightblue_tile'), 
                new Square(285, 315, 'white_tile'), 
                new Square(315, 315, 'lightblue_tile'), 
                new Square(345, 315, 'white_tile'), 
                new Square(375, 315, 'white_tile'), 
                new Square(405, 315, 'white_tile'), 
                new Square(435, 315, 'lightblue_tile'), 
                new Square(465, 315, 'white_tile'), 
                new Square(495, 315, 'white_tile')
            ], 
            [
                new Square(75, 345, 'white_tile'), 
                new Square(105, 345, 'blue_tile'), 
                new Square(135, 345, 'white_tile'), 
                new Square(165, 345, 'white_tile'), 
                new Square(195, 345, 'white_tile'), 
                new Square(225, 345, 'blue_tile'), 
                new Square(255, 345, 'white_tile'), 
                new Square(285, 345, 'white_tile'), 
                new Square(315, 345, 'white_tile'), 
                new Square(345, 345, 'blue_tile'), 
                new Square(375, 345, 'white_tile'), 
                new Square(405, 345, 'white_tile'), 
                new Square(435, 345, 'white_tile'), 
                new Square(465, 345, 'blue_tile'), 
                new Square(495, 345, 'white_tile')
            ], 
            [
                new Square(75, 375, 'white_tile'), 
                new Square(105, 375, 'white_tile'), 
                new Square(135, 375, 'white_tile'), 
                new Square(165, 375, 'white_tile'), 
                new Square(195, 375, 'pink_tile'), 
                new Square(225, 375, 'white_tile'), 
                new Square(255, 375, 'white_tile'), 
                new Square(285, 375, 'white_tile'), 
                new Square(315, 375, 'white_tile'), 
                new Square(345, 375, 'white_tile'), 
                new Square(375, 375, 'pink_tile'), 
                new Square(405, 375, 'white_tile'), 
                new Square(435, 375, 'white_tile'), 
                new Square(465, 375, 'white_tile'), 
                new Square(495, 375, 'white_tile')
            ], 
            [
                new Square(75, 405, 'lightblue_tile'), 
                new Square(105, 405, 'white_tile'), 
                new Square(135, 405, 'white_tile'), 
                new Square(165, 405, 'pink_tile'), 
                new Square(195, 405, 'white_tile'), 
                new Square(225, 405, 'white_tile'), 
                new Square(255, 405, 'white_tile'), 
                new Square(285, 405, 'lightblue_tile'), 
                new Square(315, 405, 'white_tile'), 
                new Square(345, 405, 'white_tile'), 
                new Square(375, 405, 'white_tile'), 
                new Square(405, 405, 'pink_tile'), 
                new Square(435, 405, 'white_tile'), 
                new Square(465, 405, 'white_tile'), 
                new Square(495, 405, 'lightblue_tile')
            ],
            [
                new Square(75, 435, 'white_tile'), 
                new Square(105, 435, 'white_tile'), 
                new Square(135, 435, 'pink_tile'), 
                new Square(165, 435, 'white_tile'), 
                new Square(195, 435, 'white_tile'), 
                new Square(225, 435, 'white_tile'), 
                new Square(255, 435, 'lightblue_tile'), 
                new Square(285, 435, 'white_tile'), 
                new Square(315, 435, 'lightblue_tile'), 
                new Square(345, 435, 'white_tile'), 
                new Square(375, 435, 'white_tile'), 
                new Square(405, 435, 'white_tile'), 
                new Square(435, 435, 'pink_tile'), 
                new Square(465, 435, 'white_tile'), 
                new Square(495, 435, 'white_tile')
            ],
            [
                new Square(75, 465, 'white_tile'), 
                new Square(105, 465, 'pink_tile'), 
                new Square(135, 465, 'white_tile'), 
                new Square(165, 465,'white_tile'), 
                new Square(195, 465, 'white_tile'), 
                new Square(225, 465, 'blue_tile'), 
                new Square(255, 465, 'white_tile'), 
                new Square(285, 465, 'white_tile'), 
                new Square(315, 465, 'white_tile'), 
                new Square(345, 465, 'blue_tile'), 
                new Square(375, 465, 'white_tile'), 
                new Square(405, 465, 'white_tile'), 
                new Square(435, 465, 'white_tile'), 
                new Square(465, 465, 'pink_tile'), 
                new Square(495, 465, 'white_tile')
            ],
            [
                new Square(75, 495, 'red_tile'), 
                new Square(105, 495, 'white_tile'), 
                new Square(135, 495, 'white_tile'), 
                new Square(165, 495, 'lightblue_tile'), 
                new Square(195, 495, 'white_tile'), 
                new Square(225, 495, 'white_tile'), 
                new Square(255, 495, 'white_tile'), 
                new Square(285, 495, 'red_tile'), 
                new Square(315, 495, 'white_tile'), 
                new Square(345, 495, 'white_tile'), 
                new Square(375, 495, 'white_tile'), 
                new Square(405, 495, 'lightblue_tile'), 
                new Square(435, 495, 'white_tile'), 
                new Square(465, 495, 'white_tile'), 
                new Square(495, 495, 'red_tile')
            ]
        ];
    }
}
