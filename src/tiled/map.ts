import { TiledLayer, parseTiledLayers } from "./layer";
import { TiledProperty, parseTiledProperties } from "./property";
import { TiledTileset, parseTiledTilesets } from "./tileset";

export function parseTiledMap(obj: any): TiledMap {
    const tilesets = parseTiledTilesets(obj.tilesets!);
    const properties = obj.properties && parseTiledProperties(obj.properties!);
    const layers = parseTiledLayers(obj.layers!);

    return {
        height: obj.height,
        width: obj.width,
        tileHeight: obj.tileheight,
        tileWidth: obj.tilewidth,

        layers,
        tilesets,
        properties
    }
}

export interface TiledMap {
    height: number,
    width: number,
    
    tileHeight: number,
    tileWidth: number

    layers: TiledLayer[],

    tilesets: TiledTileset[],

    properties?: TiledProperty[]
}



