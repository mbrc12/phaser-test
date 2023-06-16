import { Scene } from "phaser"
import { IWorld } from "bitecs"

export * as TilemapHelpers from "./tilemaps"
export * as ECSHelpers from "./ecs"
export * as PhysicsHelpers from "./physics"

export * as Storage from "./storage"


// Scene with more stuff like physics and world
export interface GameScene extends Scene {
    world: planck.World
    ecs: IWorld
}
