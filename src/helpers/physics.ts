import { Polygon } from "planck";
import { GameScene } from ".";
import { DEBUG_DEPTH, DEBUG_STROKE_ALPHA, DEBUG_STROKE_COLOR, DEBUG_STROKE_WIDTH } from "../globals";

export function debugRender(scene: GameScene): void {
    for (var body = scene.world.getBodyList(); body; body = body.getNext()) {
        let bodyPosition = body.getPosition();

        for (var fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
            if (!fixture.getUserData()) {
                let fixturePolygon = fixture.getShape() as Polygon
                let angle = body.getAngle()

                let polygon = 
                    scene.add.polygon(bodyPosition.x, bodyPosition.y, fixturePolygon.m_vertices);
                polygon.setRotation(angle)

                polygon.setStrokeStyle(DEBUG_STROKE_WIDTH, 
                                       DEBUG_STROKE_COLOR, 
                                       DEBUG_STROKE_ALPHA);

                polygon.setDepth(DEBUG_DEPTH);
                polygon.setOrigin(0, 0);

                fixture.setUserData(polygon);
            } else {
                const polygon = fixture.getUserData() as Phaser.GameObjects.Polygon;
                polygon.setPosition(bodyPosition.x, bodyPosition.y);
                polygon.setRotation(body.getAngle())
            }
        }
    }
}
