/// <reference types="cheerio" />
import { Cache, MemoryCache } from '@chasidic/cache';
import { Options } from 'xmldom';
export declare class Scraper {
    private _cache;
    private _sleep;
    private _retries;
    constructor({ cache, sleep, retries }?: {
        cache?: string | Cache<string> | MemoryCache;
        sleep?: number;
        retries?: number;
    });
    fetch(uri: string): Promise<void>;
    load(uri: string): Promise<string>;
    loadDOM(uri: string, options?: Options): Promise<Document>;
    loadCheerio(uri: string): Promise<CheerioStatic>;
    tree(uri: string, indent?: number): Promise<string>;
}
