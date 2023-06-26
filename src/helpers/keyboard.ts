import { Input } from "phaser";
import { GameScene } from "./game-scene";

export type KeySpec = {
    [k: string]: number
}

export type KeyboardManager<T> = {
    [k in keyof T]: KeyInfo
}

export class KeyInfo {
    scene: GameScene
    keyCode: number
    key: Input.Keyboard.Key

    constructor(scene: GameScene, key: number) {
        this.scene = scene
        this.keyCode = key
        
        if (!scene.input.keyboard) {
            throw new Error("Scene doesnt support keyboard input.")
        }

        this.key = scene.input.keyboard.addKey(key)
    }

    down(): boolean {
        return this.key.isDown
    }

    justDown(): boolean {
        return Input.Keyboard.JustDown(this.key)
    }
}

export function setupKeyboardInput<T extends KeySpec>(scene: GameScene, spec: T): KeyboardManager<T> { 
    return Object.fromEntries(Object.entries(spec).map(([name, code]) => {
        return [name, new KeyInfo(scene, code)]
    })) as KeyboardManager<T>
}

