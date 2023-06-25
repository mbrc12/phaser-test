import { Tilemaps, Animations } from "phaser"

import * as planck from "planck"
import { Polygon, Vec2 } from "planck"

import * as bitecs from "bitecs"

import level from "../assets/tilemaps/tilemap-1.json?url"
import tileset from "../assets/tilemaps/proto-tiles.png?url"

import ciRunPng from "../assets/character/ci-run.png?url"
import ciNormalPng from "../assets/character/ci-normal.png?url"

import { TilemapHelpers, PhysicsHelpers, GameScene, Store } from "../helpers"
import { GRAVITY, PHYSICS_STEP, PLAYER_LAYER, PLAYER_MASK } from "../globals"


// import ciRunJson from "../assets/character/ci-run.json?url";


export default class TiledTest extends GameScene {

    map!: Tilemaps.Tilemap;
    tileset!: Tilemaps.Tileset;
    world: planck.World;
    ecs: bitecs.IWorld;
    store: Store

    constructor() {
        super('tiled-test')
        this.world = planck.World(Vec2(0, GRAVITY))
        this.ecs = bitecs.createWorld()
        this.store = new Store()
    }

    preload() {
        this.load.tilemapTiledJSON('level', level)
        this.load.image('tileset', tileset)
        this.load.image('ci-normal', ciNormalPng)
        this.load.spritesheet('ci-run', ciRunPng, {frameWidth: 24})
    }

    create() {
        this.time.addEvent({
            delay: PHYSICS_STEP * 1000.0, // milliseconds
            loop: true,
            callback: this.physicsUpdate,
            callbackScope: this
        })

        this.map = this.make.tilemap({ key: 'level' })
        this.tileset = this.map.addTilesetImage('prototype-tiles', 'tileset')!
        const layer = this.map.createLayer("tile-layer-1", this.tileset, 0, 0)!

        // console.log(this.map.images)

        TilemapHelpers.extractCollisionObjects(this, layer)
        const objects = TilemapHelpers.getObjectLayer("objects", this.map)
       
        const playerStart = {
            x: objects.get("player-start")!.x!,
            y: objects.get("player-start")!.y!
        }

        const ciRun = this.anims.create({
            key: "ci-run",
            frames: this.anims.generateFrameNumbers("ci-run", {start: 0, end: 5}),
            frameRate: 15,
            repeat: -1
        }) as Animations.Animation


        let ciSprite = this.add.sprite(playerStart.x, playerStart.y, "ci-normal")
        ciSprite.anims.play(ciRun)
        ciSprite.anims.stopAfterDelay(3000)
        ciSprite.on("animationstop", function(this: any) {
            this.setTexture("ci-normal");
        })

        ciSprite.setOrigin(0, 0)

        let ciBody = this.world.createDynamicBody({
            position: new Vec2(playerStart.x, playerStart.y),
        })

        ciBody.createFixture({
            shape: new Polygon([new Vec2(0, 0), new Vec2(0, 24), new Vec2(24, 24), new Vec2(24, 0)]),
            filterCategoryBits: PLAYER_LAYER,
            filterMaskBits: PLAYER_MASK,
            density: 1,
        })

        // this.cameras.main.centerOn(0, 0);
    }

    update(_time: number, _delta: number): void {
        PhysicsHelpers.debugRender(this)
    }

    physicsUpdate(): void {
        if (this.world) {
            this.world.step(PHYSICS_STEP)
        }
    }
}
