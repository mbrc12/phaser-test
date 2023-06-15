import { Scene, Tilemaps, Animations } from "phaser";

import level from "../assets/tilemaps/tilemap-1.json?url";
import tileset from "../assets/tilemaps/proto-tiles.png?url";

import ciRunPng from "../assets/character/ci-run.png?url";
import ciNormalPng from "../assets/character/ci-normal.png?url";

import Helpers from "./tilemap-helpers"

// import ciRunJson from "../assets/character/ci-run.json?url";

import * as planck from "planck";
import { Vec2 } from "planck";

export default class TiledTest extends Scene {

    map!: Tilemaps.Tilemap;
    tileset!: Tilemaps.Tileset;
    world!: planck.World;

    constructor() {
        super('tiled-test');
        this.world = planck.World(new Vec2(0, 0));
    }

    preload() {
        this.load.tilemapTiledJSON('level', level);
        this.load.image('tileset', tileset);
        this.load.image('ci-normal', ciNormalPng);
        this.load.spritesheet('ci-run', ciRunPng, {frameWidth: 24});
    }

    create() {
        this.map = this.make.tilemap({ key: 'level' });
        this.tileset = this.map.addTilesetImage('prototype-tiles', 'tileset')!;
        const layer = this.map.createLayer("tile-layer-1", this.tileset, 0, 0)!;

        console.log(this.map.images)

        Helpers.extractCollisionObjects(this, layer)

        Helpers.debugRender(this)

        const objects = new Map<string, Phaser.Types.Tilemaps.TiledObject>();
        this.map.getObjectLayer("objects")!.objects.forEach((obj) => {
            objects.set(obj.name, obj);
        })
       
        const playerStart = {
            x: objects.get("player-start")!.x!,
            y: objects.get("player-start")!.y!
        }

        const ciRun = this.anims.create({
            key: "ci-run",
            frames: this.anims.generateFrameNumbers("ci-run", {start: 0, end: 5}),
            frameRate: 15,
            repeat: -1
        }) as Animations.Animation;


        let ciSprite = this.add.sprite(playerStart.x, playerStart.y, "ci-normal");
        ciSprite.anims.play(ciRun);
        ciSprite.anims.stopAfterDelay(3000);
        ciSprite.on("animationstop", function(this: any) {
            this.setTexture("ci-normal");
        });
        // this.cameras.main.centerOn(0, 0);
    }

    update(_time: number, _delta: number): void {
    }
}
