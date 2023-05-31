import { parseTiledObject } from "./object";
import parseTiledTile from "./tile";

const object_test = {
    "gid":5,
    "height":0,
    "id":1,
    "name":"villager",
    "properties":[
        {
            "name":"hp",
            "type":"int",
            "value":12
        }],
        "rotation":0,
        "type":"npc",
        "visible":true,
        "width":0,
        "x":32,
        "y":32
}

test('object-parsing-doesnt-fail', () => {
    expect(parseTiledObject(object_test)!.kind).toBe("rectangle");
});

const tile_test = {
    "id": 42,
    "objectgroup":
    {
        "draworder": "index",
        "id": 2,
        "name": "",
        "objects": [
            {
                "height": 8,
                "id": 6,
                "name": "collider",
                "rotation": 0,
                "type": "",
                "visible": true,
                "width": 8,
                "x": 0,
                "y": 0
            }],
        "opacity": 1,
        "type": "objectgroup",
        "visible": true,
        "x": 0,
        "y": 0
    },
    "properties": [
        {
            "name": "solid",
            "type": "bool",
            "value": true
        }]
}

test('tile-parsing-doesnt-fail', () => {
    const tile = parseTiledTile({ obj: tile_test });
    // console.log(tile);
    expect(tile).not.toBeUndefined();
});
