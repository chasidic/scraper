export declare const uniq: (array: any) => {}[];
export declare const uniqMap: <T>(array: T[]) => Map<T, number>;
export declare const stringArray: (val: string | string[]) => string[];
export interface IFetcher {
    uri: string;
    err?: any;
    res?: any;
    success?: 'cache' | 'fetch';
    cache?: string;
}
export declare const isXMLFile: (uri: any) => boolean;
export declare const requestAsync: (uri: string) => Promise<IFetcher>;
export declare function sleep(ms?: number): Promise<{}>;
