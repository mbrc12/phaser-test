import { parseTiledObject } from "./object";

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