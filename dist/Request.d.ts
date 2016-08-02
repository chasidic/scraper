/// <reference types="bluebird" />
import { IFetcher } from './common';
export declare class Request {
    private cache;
    private _loadURI(uri);
    private _fetcher(uri);
    get(url: string | string[], LIMIT?: number): Promise<CheerioStatic[]>;
    fetch(url: string | string[], LIMIT?: number): Promise<IFetcher[]>;
}
