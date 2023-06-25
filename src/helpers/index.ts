import { defineQuery, IWorld } from "bitecs"
import { Scene } from "phaser"
import * as planck from "planck"
import { PHYSICS_STEP } from "../globals"

import { GameQuery, RawSystem, StoredComponent, StoredComponentList, System } from "./ecs"

export * as TilemapHelpers from "./tilemaps"
export { StoredComponent } from "./ecs"
export * as PhysicsHelpers from "./physics"

import { Store } from "./store"
export { Store } from "./store"


// Scene with more stuff like physics and world and storage

export abstract class GameScene extends Scene {
    world!: planck.World
    ecs!: IWorld
    store!: Store

    systems: System<any>[] = []
    physicsSystems: System<any>[] = []

    protected registerComponent<T>(): StoredComponent<T> {
        return new StoredComponent<T>(this.ecs, this.store)
    }

    protected registerQuery<T extends unknown[]>(components: StoredComponentList<T>): GameQuery<T> {
        return {
            ecs: this.ecs,
            query: defineQuery(components.map((sc) => sc.component)),
            components: components,

            ask(): number[] {
                return this.query(this.ecs)
            }
        }
    }

    protected registerSystem<T extends unknown[]>(query: GameQuery<T>, system: RawSystem<[...T]>) {
        this.systems.push({
            query: query,
            callback: system
        })
    }

    protected registerPhysicsSystem<T extends unknown[]>(query: GameQuery<T>, system: RawSystem<[...T]>) {
        this.physicsSystems.push({
            query: query,
            callback: system
        })
    }

    protected system<T extends unknown[]>(components: StoredComponentList<T>, system: RawSystem<[...T]>) {
        this.registerSystem(this.registerQuery<T>(components), system)
    }

    protected physicsSystem<T extends unknown[]>(components: StoredComponentList<T>, system: RawSystem<[...T]>) {
        this.registerPhysicsSystem(this.registerQuery<T>(components), system)
    }


    create() {
        this.time.addEvent({
            delay: PHYSICS_STEP * 1000.0, // milliseconds
            loop: true,
            callback: this.physicsUpdate,
            callbackScope: this
        })
    }

    runSystems(systems: System<any>[]): void {
        systems.forEach(({query, callback}) => {
            query.ask().forEach((eid) => {
                const components = query.components.map((comp) => comp.get(eid))
                callback(this, ...components)
            })
        })
    }

    update(_time: number, _delta: number): void {
        this.runSystems(this.systems)
    }

    physicsUpdate(): void {
        this.runSystems(this.physicsSystems)
        if (this.world) {
            this.world.step(PHYSICS_STEP)
        }
    }
}
