import { TiledLayer } from "./layer";
import { TiledProperty } from "./property";

export interface TiledMap {
    height: number,
    width: number,

    layers: TiledLayer[],

    properties?: TiledProperty[],

    tileHeight: number,
    tileWidth: number
}

