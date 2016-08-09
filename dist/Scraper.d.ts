/// <reference types="bluebird" />
/// <reference types="cheerio" />
import { Cache } from '@chasidic/cache';
import { IRequestFetcher } from './requestAsync';
export declare type IScraperNotifier = (uri: string, count: string) => void;
export interface IScraperOptions {
    cacheDir?: string;
    sleep?: number;
    retries?: number;
    notify?: IScraperNotifier;
}
export declare class Scraper {
    cache: Cache;
    private _sleep;
    private _retries;
    private _notify;
    constructor(options?: IScraperOptions);
    private _loadURI(uri);
    private _fetcher(uri);
    get(url: string | string[], LIMIT?: number): Promise<CheerioStatic[]>;
    fetch(url: string | string[], LIMIT?: number): Promise<IRequestFetcher[]>;
}
