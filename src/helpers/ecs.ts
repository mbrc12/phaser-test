import { addComponent, ComponentType, defineComponent, IWorld, Query, Types }  from "bitecs";
import { GameScene, Store } from ".";

export type GameQuery<T extends unknown[]> = {
    ecs: IWorld,
    query: Query<IWorld>,
    components: StoredComponentList<T>,
    ask: () => number[]
}

export type RawSystem<T extends unknown[]> = (scene: GameScene, ...components: [...T]) => void

export type System<T extends unknown[]> = {
    query: GameQuery<T>,
    callback: RawSystem<T>
}

export class StoredComponent<T> {
    ecs: IWorld
    store: Store

    component: ComponentType<{id: "ui32"}>

    constructor(ecs: IWorld, store: Store) {
        this.ecs = ecs
        this.component = defineComponent({id: Types.ui32})
        this.store = store
    }
    
    get(eid: number): T {
        const ptr = this.component.id[eid]
        const item = this.store.get(ptr)
        return item as T
    }

    insertIn(eid: number, obj: T) {
        const ptr = this.store.add(obj)
        addComponent(this.ecs, this.component, eid)
        this.component.id[eid] = ptr
    }
}

// [T1, T2] => [StoredComponent<T1>, StoredComponent<T2>]
export type StoredComponentList<T extends unknown[]> = { [K in keyof T]: StoredComponent<T[K]> }
