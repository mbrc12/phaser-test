import { BG_COLOR, HEIGHT, WIDTH } from './globals';
// import Main from './scenes/main';

import { Game, WEBGL } from 'phaser';
// import TiledTest from './scenes/tiled-test';
import ECSTest, { ShaderFX } from './scenes/ecstest';
import TiledTest from './scenes/tiled-test';


///////////////// GAME SETUP ////////////////////////

const canvas = document.getElementById('game') as HTMLCanvasElement;

const computeZoom = (w: number, h: number, tw: number, th: number) => Math.min(tw/w, th/h);

const config = {
    type: WEBGL,
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: BG_COLOR,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: computeZoom(WIDTH, HEIGHT, window.innerWidth, window.innerHeight),
    canvas,
    scene: [
        // TiledTest
        ECSTest
    ],
    // antialias: false,
    pixelArt: true,
    autoFocus: true,
    disableContextMenu: true,

    // pipeline: { name: 'ShaderFX', pipeline: ShaderFX },
}

const game = new Game(config);

//// resize event handler


window.addEventListener("resize", () => {
    const zoom = computeZoom(WIDTH, HEIGHT, window.innerWidth, window.innerHeight);
    game.scale.setZoom(zoom);
});
