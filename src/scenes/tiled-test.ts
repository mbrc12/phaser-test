import { Scene, Tilemaps  } from "phaser";
import level1 from "../assets/map/level-1.json?url";
import tileset from "../assets/map/tiles.png?url";
import { parseTiledObjects } from "../tiled";

export default class TiledTest extends Scene {
    map?: Tilemaps.Tilemap;
    tileset?: Tilemaps.Tileset;

    constructor() {
        super('tiled-test');
    }

    preload() {
        this.load.tilemapTiledJSON('level-1', level1);
        this.load.image('tileset', tileset);
    }

    create() {
        this.map = this.make.tilemap({key: 'level-1'});
        this.tileset = this.map.addTilesetImage('tiles-1', 'tileset')!;
        // this.map.createLayer(0, this.tileset, 0, 0);
        const layer = this.map.createLayer(1, this.tileset, 0, 0)!;
        this.extractCollisionObjects(layer);

        // const tile = layer.putTileAt(layer.getTileAt(18,18), 3, 1);
        const tile = layer.getTileAt(5, 1);
        console.log(tile);
        console.log(tile.getCollisionGroup());
        // console.log(this.tileset.getTileCollisionGroup(tile.index));

        this.extractCollisionObjects(layer);

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

    getCollidersOfTile(tile: Tilemaps.Tile): MatterJS.BodyType[] {

        const tx = tile.pixelX;
        const ty = tile.pixelY;
        const tw = tile.width;
        const th = tile.height;

        const bodies = [] as MatterJS.BodyType[];

        const collisions = tile.getCollisionGroup() as any;

        if (collisions) {
            const colliders = parseTiledObjects(collisions.objects!)!;
            colliders.forEach((collider) => {
                if (collider.kind == "rectangle") {
                    let x1 = collider.x;
                    let y1 = collider.y;
                    let cw = collider.width;
                    let ch = collider.height;

                    let mx = x1 + cw / 2;
                    let my = y1 + ch / 2;

                    if (tile.flipX) {
                        mx = tw - mx;
                    }
                    if (tile.flipY) {
                        my = th - my;
                    }

                    this.matter.add.rectangle(tx + mx, ty + my, cw, ch, {
                        isStatic: true
                    });
                }
            });
        }

        return bodies;
    }
}
