import { Scene } from 'phaser';
import mario from './assets/audio/Mario-coin-sound.mp3';
import fontpng from './assets/fonts/additional/fonts/minogram_6x10.png?url';
import fontxml from './assets/fonts/additional/fonts/minogram_6x10.xml?url';

export default function (scene: Scene) {
    // console.log(leaguePng);
    scene.load.bitmapFont("default", fontpng, fontxml);
    scene.load.audio("mario-coin", mario);
    // scene.load.image("pics/waifu", waifu);
}
