import { parseTiledTileset } from "./tileset";
import tileset_test from "../assets/map/tiles-1.json";

test('tileset-parsing-doesnt-fail', () => {
    const tileset = parseTiledTileset(tileset_test);
    // console.log(tileset);
    expect(tileset).not.toBeUndefined();
    expect(tileset.firstGid).toBe(0);
});
