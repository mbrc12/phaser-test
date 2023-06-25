import * as bitecs from "bitecs"
import { GameObjects } from "phaser"
import * as planck from "planck"
import { Polygon, Vec2 } from "planck"
import { Assets } from "../assets"
import { DIAGNOSTICS_DEPTH, GRAVITY, HEIGHT, TREE_LAYER, TREE_MASK, WIDTH } from "../globals"
import { GameScene, PhysicsHelpers, Store, StoredComponent } from "../helpers"

type Vars = {
    last: number // last time impulses were applied
}

export default class ECSTest extends GameScene {

    world: planck.World
    ecs: bitecs.IWorld
    store: Store

    cSprite: StoredComponent<GameObjects.Sprite>
    cBody: StoredComponent<planck.Body>
    cVars: StoredComponent<Vars>
    cText: StoredComponent<GameObjects.Text>

    constructor() {
        super('ecs-test')

        this.world = planck.World(new Vec2(0, GRAVITY))
        this.ecs = bitecs.createWorld()
        this.store = new Store()

        this.cSprite = this.registerComponent<GameObjects.Sprite>()
        this.cBody = this.registerComponent<planck.Body>()
        this.cVars = this.registerComponent<Vars>()

        this.cText = this.registerComponent<GameObjects.Text>()

        this.system([this.cSprite, this.cBody], treeSystem)
        this.system([this.cText], fpsSystem)
        this.physicsSystem([this.cBody, this.cVars], bodySystem)
    }

    preload() {
        this.load.image("tree", Assets.art.tree)
        this.load.audio("click", Assets.audio.click)
    }

    create() {
        super.create()

        this.time.addEvent({
            delay: 5000.0,
            loop: true,
            callback: () => {
                this.sound.play("click")
                const gravity = this.world.getGravity()
                this.world.setGravity(gravity.mul(-1))
            }
        })

        const eid = bitecs.addEntity(this.ecs)
        const text = this.add.text(0, 0, "fps: 0")
        text.setDepth(DIAGNOSTICS_DEPTH)
        this.cText.insertIn(eid, text)
        

        for (let i = 0; i < 100; i++) {
            const eid = bitecs.addEntity(this.ecs)

            const x = Math.random() * WIDTH
            const y = Math.random() * HEIGHT

            const sprite = this.add.sprite(x, y, "tree")
            sprite.setOrigin(0, 0)
            this.cSprite.insertIn(eid, sprite)

            const body = this.world.createDynamicBody({
                position: new Vec2(x, y),
                allowSleep: false
            })
            body.createFixture({
                shape: new Polygon([new Vec2(0, 0), new Vec2(0, 24), new Vec2(24, 24), new Vec2(24, 0)]),
                filterCategoryBits: TREE_LAYER,
                filterMaskBits: TREE_MASK,
                density: 1
            })

            this.cBody.insertIn(eid, body)
            this.cVars.insertIn(eid, { last: this.time.now })
        }

        PhysicsHelpers.addWalls(this)
    }

    update(time: number, delta: number): void {
        super.update(time, delta)

        PhysicsHelpers.debugRender(this)
    }

    physicsUpdate(): void {
        super.physicsUpdate()
    }

}

// Systems

function treeSystem(_scene: GameScene, sprite: GameObjects.Sprite, body: planck.Body) {
    const {x, y} = body.getPosition()

    sprite.setPosition(x, y)
    sprite.setRotation(body.getAngle())
}

function bodySystem(scene: GameScene, body: planck.Body, vars: Vars) {
    const now = scene.time.now

    if (now - vars.last > 1000) {
        const dx = Math.random() * 1000 - 500
        const dy = Math.random() * 1000 - 500

        body.applyLinearImpulse(Vec2(dx, dy).mul(body.getMass()), 
                                body.getWorldCenter())
                                vars.last = now
    }
}

function fpsSystem(scene: GameScene, text: GameObjects.Text) {
    text.setText("fps: " + scene.game.loop.actualFps.toFixed(0))
}

