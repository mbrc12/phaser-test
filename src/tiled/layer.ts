import { TiledObject, parseTiledObjects } from "./object";
import { TiledProperty, parseTiledProperties } from "./property";

export function parseTiledLayers(obj: any[]): TiledLayer[] {
    return obj.map((layer) => parseTiledLayer(layer));
}

export function parseTiledLayer(obj: any): TiledLayer {

    const properties = obj.properties && parseTiledProperties(obj.properties!);
    const result: any = {
        id: obj.id,
        name: obj.name,
        
        properties 
    };

    switch(obj.type) {
        case "tilelayer": 
            result.kind = "tile-layer"
            result.data = obj.data;
            result.height = obj.height;
            result.width = obj.width;
            break;
        case "objectground":
            result.kind = "object-layer";
            result.objects = obj.objects && parseTiledObjects(obj.objects!);
            break;
        case "imagelayer":
            result.kind = "image-layer";
            result.image = obj.image;
            result.repeatX = obj.repeatx;
            result.repeatY = obj.repeaty;
            break;
        default:
            throw new Error("Unsupported layer type!");
    }

    return result;
}

interface BaseTiledLayer {
    id: number,
    name: string,

    properties?: TiledProperty[]
}

export interface TiledTileLayer extends BaseTiledLayer {
    kind: "tile-layer",

    data: number[],
    height: number,
    width: number
}

export interface TiledObjectLayer extends BaseTiledLayer {
    kind: "object-layer",

    objects: TiledObject[]
}

export interface TiledImageLayer extends BaseTiledLayer {
    kind: "image-layer",

    image: string,
    repeatX: boolean,
    repeatY: boolean,
}

export type TiledLayer = TiledTileLayer | TiledObjectLayer | TiledImageLayer;

