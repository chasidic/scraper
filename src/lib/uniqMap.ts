export function uniqMap<T>(array: T[]) {
    let map = new Map<T, number>();
    for (let i of array) map.set(i, (map.get(i) || 0) + 1);
    return map;
};
