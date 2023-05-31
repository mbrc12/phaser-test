import { Scene, Sound } from "phaser";
import loader from "../loader";
import keyManager, { GameKeyManager } from "../actions";

export default class Main extends Scene {
    camera?: Phaser.Cameras.Scene2D.Camera;
    text?: Phaser.GameObjects.BitmapText;

    keyManager?: GameKeyManager;
    mario?: Sound.WebAudioSound;

    cnt: number = 0;
    
    
    constructor() {
        super('scene-main');
    }

    preload() {
        loader(this);
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.centerOn(0, 0);

        this.registry.set("count", 0);

        this.keyManager = keyManager(this);

        this.text = this.add.dynamicBitmapText(0, 0, "default", "", 70);
        this.text.setOrigin(0.5, 0.5);

        this.text.setTintFill(0xfea0a0);

        this.mario = this.sound.add("mario-coin") as Sound.WebAudioSound;
        this.mario.setVolume(0.1);

        this.mario.on("complete", this.resetMario, this);
        this.mario.play();

        console.log(this.mario);
    }

    update(_time: number, _delta: number) {

        if (this.keyManager!.isDown("jump")) {
            this.camera?.shake()
        }

        // console.log(this.mario!);

        if (this.keyManager!.isJustDown("select")) {

            //console.log(this.mario);
            // if (!this.mario!.isPlaying) {
            //     console.log("Pressed and not playing");
            // }

            const count = this.registry.get("count");
            if (count == 0) {
                this.text?.setTint(0xa0a0fe);
            } else {
                this.text?.setTint(0xfea0a0);
            }
            this.registry.set("count", 1 - count);
        }
    }

    resetMario() {
        //console.log(">>> ", this);
        //this.mario!. (Math.random() * 2 - 1) * 100;
        this.text!.text = "Total count: " + this.cnt;
        this.cnt += 1;
        this.mario!.play();
    }
}

