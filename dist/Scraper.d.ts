import { Cache } from '@chasidic/cache';
import { ScraperItem } from './ScraperItem';
export declare class Scraper {
    private _cache;
    private _sleep;
    private _retries;
    constructor({cacheDir, sleep, retries}?: {
        cacheDir?: string;
        sleep?: number;
        retries?: number;
    });
    readonly cache: Cache;
    readonly sleep: number;
    readonly retries: number;
    create(url: string): ScraperItem;
}
