import { TiledObject, parseTiledObjects } from "./object";
import { TiledProperty, parseTiledProperties } from "./property";

export default function parseTiledTile(obj: any): TiledTile {
    const id = obj.id;
    const properties = obj.properties && parseTiledProperties(obj.properties!);
    const objects = obj.objectgroup && parseTiledObjects(obj.objectgroup.objects!)

    return {
        id,
        properties,
        objects
    }
}

export interface TiledTile {
    id: number,
    properties?: TiledProperty[],
    objects?: TiledObject[]
}