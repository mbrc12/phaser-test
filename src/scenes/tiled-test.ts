import { Scene, Tilemaps, Animations } from "phaser";

import level from "../assets/tilemaps/tilemap-1.json?url";
import tileset from "../assets/tilemaps/proto-tiles.png?url";

import ciRunPng from "../assets/character/ci-run.png?url";
import ciNormalPng from "../assets/character/ci-normal.png?url";

// import ciRunJson from "../assets/character/ci-run.json?url";

import { parseTiledObjects } from "../tiled";

import * as planck from "planck";
import { Polygon, Vec2 } from "planck";
import { DEBUG_DEPTH, DEBUG_STROKE_ALPHA, DEBUG_STROKE_COLOR, DEBUG_STROKE_WIDTH } from "../globals";

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

        console.log(this.map.images);

        this.extractCollisionObjects(layer)

        this.debugRender()

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


        let ciSprite = this.add.sprite(playerStart.x, playerStart.y, "ci-normal"); //.play(ciRun);
        ciSprite.anims.play(ciRun);
        ciSprite.anims.stopAfterDelay(3000);
        ciSprite.on("animationstop", function(this: any) {
            this.setTexture("ci-normal");
        });
        // this.cameras.main.centerOn(0, 0);
    }

    update(_time: number, _delta: number): void {
    }

    extractCollisionObjects(layer: Tilemaps.TilemapLayer) {
        const width = layer.width;
        const height = layer.height;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tile = layer.getTileAt(x, y);
                if (tile) {
                    this.getCollidersOfTile(tile);
                }
            }
        }
    }

    getCollidersOfTile(tile: Tilemaps.Tile): planck.Body[] {
        const tx = tile.pixelX;
        const ty = tile.pixelY;
        const tw = tile.width;
        const th = tile.height;

        const bodies = [] as planck.Body[];

        const collisions = tile.getCollisionGroup() as any;

        if (collisions) {
            const colliders = parseTiledObjects(collisions.objects!)!;
            colliders.forEach((collider) => {
                if (collider.kind == "polygon") {
                    let points = collider.points.map((pt) => {

                        // This tile rotation code only works if the rotation is pi or 0. 

                        let fin = Phaser.Math.Rotate({x: pt.x - tw/2, y: pt.y - th/2}, tile.rotation);
                        if (tile.flipX) {
                            fin.x = -fin.x;
                        }

                        return new Vec2(fin.x + tw/2, fin.y + th/2);
                    })

                    const body = this.world.createKinematicBody({
                        position: new Vec2(tx, ty),
                        awake: false
                    });

                    body.createFixture({
                        shape: new Polygon(points),
                        filterCategoryBits: 0x0001,
                        filterMaskBits: 0x0010,
                    });
                }
            });
        }

        return bodies;
    }

    debugRender() {

        for (var body = this.world.getBodyList(); body; body = body.getNext()) {
            let bodyPosition = body.getPosition();

            for (var fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
                if (!fixture.getUserData()) {
                    let fixturePolygon = fixture.getShape() as Polygon;
                    
                    let polygon = 
                    this.add.polygon(bodyPosition.x, bodyPosition.y, fixturePolygon.m_vertices);

                    polygon.setStrokeStyle(DEBUG_STROKE_WIDTH, DEBUG_STROKE_COLOR, DEBUG_STROKE_ALPHA);

                    polygon.setDepth(DEBUG_DEPTH);
                    polygon.setOrigin(0, 0);

                    fixture.setUserData(polygon);
                } else {
                    const polygon = fixture.getUserData() as Phaser.GameObjects.Polygon;
                    polygon.setPosition(bodyPosition.x, bodyPosition.y);
                }
            }
        }
    }
}
