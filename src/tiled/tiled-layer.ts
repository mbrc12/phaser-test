import { TiledObject } from "./tiled-object";
import { TiledProperty } from "./tiled-property";

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

