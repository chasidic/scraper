/// <reference types="bluebird" />
export declare const uniq: <T>(array: T[]) => T[];
export declare const uniqMap: <T>(array: T[]) => Map<T, number>;
export declare const stringArray: (val: string | string[]) => string[];
export declare function sleep(ms?: number): Promise<{}>;
export declare const pad: (str: string, length: number, PAD?: string) => string;
