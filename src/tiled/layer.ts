import { TiledObject } from "./object";
import { TiledProperty } from "./property";

export interface TiledLayer {
    height: number,
    width: number,
    
    id: number,
    name: string,

    type: string,

    data?: number[],

    objects?: TiledObject[],

    properties?: TiledProperty[],
}

