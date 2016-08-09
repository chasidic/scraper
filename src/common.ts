export const uniq = <T>(array: T[]) => Array.from(new Set(array));

export const uniqMap = <T>(array: T[]) => {
  let map = new Map<T, number>();
  for (let i of array) map.set(i, (map.get(i) || 0) + 1);
  return map;
};

export const stringArray = (val: string | string[]): string[] => {
  if (typeof val === 'string') {
    return [val];
  } else if (Array.isArray(val) && val.every(v => typeof v === 'string')) {
    return val;
  }

  throw new Error('Expected string or an array of strings.');
};

export function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}

