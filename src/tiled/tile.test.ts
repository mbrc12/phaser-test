import { parseTiledTile } from "./tile";

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