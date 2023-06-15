import { Scene, Tilemaps } from "phaser";
import planck, { Polygon, Vec2 } from "planck";
import { DEBUG_DEPTH, DEBUG_STROKE_ALPHA, DEBUG_STROKE_COLOR, DEBUG_STROKE_WIDTH } from "../globals";
import { parseTiledObjects } from "../tiled/object";

interface SceneWithPhysics extends Scene {
    world: planck.World
}

export default {
    extractCollisionObjects(scene: SceneWithPhysics, layer: Tilemaps.TilemapLayer) {
        const width = layer.width;
        const height = layer.height;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tile = layer.getTileAt(x, y);
                if (tile) {
                    this.getCollidersOfTile(scene, tile);
                }
            }
        }
    },

    getCollidersOfTile(scene: SceneWithPhysics, tile: Tilemaps.Tile): planck.Body[] {
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

                    const body = scene.world.createKinematicBody({
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
    },

    debugRender(scene: SceneWithPhysics) {
        for (var body = scene.world.getBodyList(); body; body = body.getNext()) {
            let bodyPosition = body.getPosition();

            for (var fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
                if (!fixture.getUserData()) {
                    let fixturePolygon = fixture.getShape() as Polygon;

                    let polygon = 
                        scene.add.polygon(bodyPosition.x, bodyPosition.y, fixturePolygon.m_vertices);

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
