"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function uniqMap(array) {
    let map = new Map();
    for (let i of array)
        map.set(i, (map.get(i) || 0) + 1);
    return map;
}
exports.uniqMap = uniqMap;
;
