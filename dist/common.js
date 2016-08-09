"use strict";
exports.uniq = (array) => Array.from(new Set(array));
exports.uniqMap = (array) => {
    let map = new Map();
    for (let i of array)
        map.set(i, (map.get(i) || 0) + 1);
    return map;
};
exports.stringArray = (val) => {
    if (typeof val === 'string') {
        return [val];
    }
    else if (Array.isArray(val) && val.every(v => typeof v === 'string')) {
        return val;
    }
    throw new Error('Expected string or an array of strings.');
};
function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}
exports.sleep = sleep;
