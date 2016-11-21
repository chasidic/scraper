import { Cache } from '@chasidic/cache';
import { ScraperItem } from './ScraperItem';

export class Scraper {
    private _cache: Cache;
    private _sleep: number;
    private _retries: number;

    constructor({ cacheDir = null, sleep = 1000, retries = 3 }: {
        cacheDir?: string;
        sleep?: number;
        retries?: number;
    } = {}) {
        this._cache = new Cache(cacheDir);
        this._sleep = sleep;
        this._retries = retries;
    }

    get cache() { return this._cache; }
    get sleep() { return this._sleep; }
    get retries() { return this._retries; }

    create(url: string) {
        return new ScraperItem(url, this);
    }
}
