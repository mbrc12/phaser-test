import { TiledProperty, parseTiledProperties } from "./property";
import { TiledTile, parseTiledTiles } from "./tile";

export function parseTiledTilesets(obj: any[]): TiledTileset[] {
    return obj.map((tileset) => parseTiledTileset(tileset));
}

export function parseTiledTileset(obj: any): TiledTileset {
    const properties = obj.properties && parseTiledProperties(obj.properties!);
    const tiles = obj.tiles && parseTiledTiles(obj.tiles!);

    return {
        firstGid: obj.firstgid || 0,
        name: obj.name,
        columns: obj.columns,

        image: obj.image,
        imageHeight: obj.imageheight,
        imageWidth: obj.imagewidth,

        spacing: obj.spacing,
        tileCount: obj.tilecount,
        tileHeight: obj.tileheight,
        tileWidth: obj.tilewidth,
        
        properties,
        tiles
    }
}

export interface TiledTileset {
    firstGid: number,
    name: string,

    columns: number,
    
    image: string,
    imageHeight: number,
    imageWidth: number,
    spacing: number,

    properties?: TiledProperty[],

    tileCount: number,

    tileHeight: number,
    tileWidth: number,

    tiles: TiledTile[],
}