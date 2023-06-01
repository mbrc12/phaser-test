import { createWorld } from "bitecs";
import { Scene } from "phaser";

export default class ECSTest extends Scene {

    world = createWorld();

    constructor() {
        super('ecs-test');
    }

    preload() {

    }

    create() {

    }

    update(_time: number, _delta: number): void {
        
    }
}