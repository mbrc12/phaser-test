import { HEIGHT, WIDTH } from './globals';
// import Main from './scenes/main';

import { Game, WEBGL } from 'phaser';
import TiledTest from './scenes/tiled-test';


///////////////// GAME SETUP ////////////////////////

const canvas = document.getElementById('game') as HTMLCanvasElement;

const computeZoom = (w: number, h: number, tw: number, th: number) => Math.min(tw/w, th/h);

const config = {
    type: WEBGL,
    width: WIDTH,
    height: HEIGHT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: computeZoom(WIDTH, HEIGHT, window.innerWidth, window.innerHeight),
    canvas,
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0 },
            debug: {
                showCollisions: true,
                showBody: true
            }
        }
    },
    scene: [
        TiledTest
    ],
    // antialias: false,
    pixelArt: true,
    autoFocus: true,
    disableContextMenu: true,
}

const game = new Game(config);

window.addEventListener("resize", () => {
    const zoom = computeZoom(WIDTH, HEIGHT, window.innerWidth, window.innerHeight);
    game.scale.setZoom(zoom);
    // console.log(zoom);
});
