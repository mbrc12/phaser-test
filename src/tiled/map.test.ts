import map_test from "../assets/map/level-1.json";
import { parseTiledMap } from "./map";

test('map-parsing-doesnt-fail', () => {
    expect(parseTiledMap(map_test).height).toBe(20);
});