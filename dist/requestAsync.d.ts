/// <reference types="bluebird" />
export interface IRequestFetcher {
    uri: string;
    err?: any;
    res?: any;
    success?: 'cache' | 'fetch';
    cache?: string;
}
export declare const isXMLFilename: (uri: string) => boolean;
export declare const requestAsync: (uri: string) => Promise<IRequestFetcher>;
