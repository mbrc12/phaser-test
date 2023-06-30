import * as bitecs from "bitecs"
import { Scene } from "phaser"
import { Vec2, World } from "planck"
import { PHYSICS_STEP } from "../globals"
import { GameQuery, Resource, ResourceList, StoredComponent, StoredComponentList, System, SystemSpec } from "./ecs"
import { Store } from "./store"

export type SystemConfig = {
    physics?: boolean, // runs on physics schedule instead of default
    static?: boolean // means that this is not called with any entities
}

const defaultSystemConfig: SystemConfig = {
    physics: false,
    static: false
}

export abstract class GameScene extends Scene {
    world!: World
    ecs!: bitecs.IWorld
    store!: Store

    systems: System<any, any>[] = []
    physicsSystems: System<any, any>[] = []

    constructor(name: string, gravity: Vec2) {
        super(name)

        this.world = new World(new Vec2(gravity))
        this.ecs = bitecs.createWorld()
        this.store = new Store()
    }
    
    protected registerComponent<T>(): StoredComponent<T> {
        return new StoredComponent<T>(this.ecs, this.store)
    }

    protected registerResource<U>(): Resource<U> {
        return new Resource<U>()
    }

    protected registerQuery<T extends unknown[]>(components: StoredComponentList<T>): GameQuery<T> {
        return {
            ecs: this.ecs,
            query: bitecs.defineQuery(components.map((sc) => sc.component)),
            components: components,

            ask(): number[] {
                return this.query(this.ecs)
            }
        }
    }

    protected registerSystem<T extends unknown[], U extends unknown[]>
    (query: GameQuery<T>, 
     resources: ResourceList<U>, 
     system: SystemSpec<T, U>, 
     config?: SystemConfig) {

        const modifiedConfig = { ...defaultSystemConfig, ...config }

        const item: System<T, U> = {
            query: query,
            resources: resources,
            isStatic: modifiedConfig.static!,
            callback: system
        }
        const which = (modifiedConfig.physics ? this.physicsSystems : this.systems)
        which.push(item)
    }


    protected system<T extends unknown[], U extends unknown[]>
    (components: StoredComponentList<T>, 
     resources: ResourceList<U>, 
     system: SystemSpec<T, U>, 
     config?: SystemConfig) {

        this.registerSystem(this.registerQuery<T>(components), resources, system, config)
    }

    create() {
        this.time.addEvent({
            delay: PHYSICS_STEP * 1000.0, // milliseconds
            loop: true,
            callback: this.physicsUpdate,
            callbackScope: this
        })
    }

    runSystems(systems: System<any, any>[]): void {
        systems.forEach(({query, resources, isStatic, callback}) => {
            
            const run = ("run" in callback) ? callback.run.bind(callback) : callback;

            if (isStatic) {
                const resourceList = resources.map((res) => res.get())
                run(this, [], resourceList)
                return
            } 

            query.ask().forEach((eid) => {
                const components = query.components.map((comp) => comp.get(eid))
                const resourceList = resources.map((res) => res.get())
                run(this, components, resourceList)
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
