import { Input, Scene } from "phaser";
import KeyCodes = Phaser.Input.Keyboard.KeyCodes;

export type GameAction = 
    "left" | "right" | "up" | "down" | "select" | "jump";

type GameKeymap = {
    [key in GameAction]: number[]
};

type GameKeys = {
    [key in GameAction]: Input.Keyboard.Key[]
};

export type GameKeyManager = {
    isDown: (action: GameAction) => boolean,
    isJustDown: (action: GameAction) => boolean
}

const GAME_KEYMAP : GameKeymap = {
    left: [KeyCodes.A, KeyCodes.LEFT],
    right: [KeyCodes.D, KeyCodes.RIGHT],
    up: [KeyCodes.W, KeyCodes.UP],
    down: [KeyCodes.D, KeyCodes.DOWN],

    jump: [KeyCodes.SPACE, KeyCodes.BACKSPACE],
    select: [KeyCodes.ENTER],
}

export default function keyManager(scene: Scene): GameKeyManager {
    let action: GameAction;
    let keys_p: Partial<GameKeys> = {};

    for (action in GAME_KEYMAP) { 
        keys_p[action] = GAME_KEYMAP[action].map(
            (key) => scene.input.keyboard!.addKey(key)
        )
    }
    
    let keys = keys_p as GameKeys; // assert everything is set

    return {
        isDown(action: GameAction): boolean {
            return keys[action].some((key) => key.isDown)
        },

        isJustDown(action: GameAction): boolean {
            return keys[action].some((key) => Input.Keyboard.JustDown(key))
        }
    };
}
