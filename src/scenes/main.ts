import { Scene } from "phaser";
import loader from "../loader";
import keyManager, { GameKeyManager } from "../actions";

export default class Main extends Scene {
    camera?: Phaser.Cameras.Scene2D.Camera;
    text?: Phaser.GameObjects.BitmapText;

    keyManager?: GameKeyManager;

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

        this.text = this.add.bitmapText(0, 0, "default", "A lot of fucking text bro", 70);
        this.text.setOrigin(0.5, 0.5);

        this.text.setTintFill(0xfea0a0);
    }

    update(_time: number, _delta: number) {


        if (this.keyManager!.isDown("jump")) {
            this.camera?.shake()
        }

        if (this.keyManager!.isJustDown("select")) {

            this.sound.play("mario-coin");

            const count = this.registry.get("count");
            if (count == 0) {
                this.text?.setTint(0xa0a0fe);
            } else {
                this.text?.setTint(0xfea0a0);
            }
            this.registry.set("count", 1 - count);
        }
    }
}

