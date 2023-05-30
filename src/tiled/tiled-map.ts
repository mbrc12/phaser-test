import { TiledLayer } from "./tiled-layer";
import { TiledProperty } from "./tiled-property";

export interface TiledMap {
    height: number,
    width: number,

    layers: TiledLayer[],

    properties?: TiledProperty[],

    tileHeight: number,
    tileWidth: number
}

