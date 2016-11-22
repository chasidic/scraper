/// <reference types="cheerio" />
import { Cache, MemoryCache } from '@chasidic/cache';
export declare class Scraper {
    private _cache;
    private _sleep;
    private _retries;
    constructor({cache, sleep, retries}?: {
        cache?: string | Cache | MemoryCache;
        sleep?: number;
        retries?: number;
    });
    fetch(uri: string): Promise<void>;
    load(uri: string): Promise<CheerioStatic>;
    tree(uri: string, indent?: number): Promise<string>;
}
