/// <reference types="bluebird" />
export declare const uniq: <T>(array: T[]) => T[];
export declare const uniqMap: <T>(array: T[]) => Map<T, number>;
export declare const stringArray: (val: string | string[]) => string[];
export declare function sleep(ms?: number): Promise<{}>;
export interface IFetcher {
    uri: string;
    err?: any;
    res?: any;
    success?: 'cache' | 'fetch';
    cache?: string;
}
export declare const isXMLFile: (uri: string) => boolean;
export declare const requestAsync: (uri: string) => Promise<IFetcher>;
