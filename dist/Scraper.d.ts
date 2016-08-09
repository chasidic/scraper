/// <reference types="bluebird" />
/// <reference types="cheerio" />
import { IRequestFetcher } from './requestAsync';
export interface IScraperOptions {
    cacheDir?: string;
    sleep?: number;
    retries?: number;
}
export declare class Scraper {
    private _cache;
    private _sleep;
    private _retries;
    constructor(options?: IScraperOptions);
    private _loadURI(uri);
    private _fetcher(uri);
    get(url: string | string[], LIMIT?: number): Promise<CheerioStatic[]>;
    fetch(url: string | string[], LIMIT?: number): Promise<IRequestFetcher[]>;
}
