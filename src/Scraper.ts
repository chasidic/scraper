import { Cache, MemoryCache } from '@chasidic/cache';
import { load } from 'cheerio';
import { isXMLFilename, requestAsync, sleep, toJade } from './lib';

export class Scraper {
    private _cache: Cache | MemoryCache;
    private _sleep: number;
    private _retries: number;

    constructor({ cacheDir = null, sleep = 1000, retries = 3 }: {
        cacheDir?: string | Cache | MemoryCache;
        sleep?: number;
        retries?: number;
    } = {}) {
        
        this._cache = cacheDir == null ? new MemoryCache() : (typeof cacheDir === 'string' ? new Cache(cacheDir) : cacheDir);
        this._sleep = sleep;
        this._retries = retries;
    }

    async fetch(uri: string) {
        if (!await this._cache.has(uri)) {
            let retries = 1;
            let error: Error = null;

            do {
                try {
                    let cache = await requestAsync(uri);
                    await this._cache.set(uri, cache);
                    return;
                } catch (e) {
                    error = e;
                    await sleep(this._sleep);
                }
            } while (++retries < this._retries);

            throw error;
        }
    }

    async load(uri: string) {
        if (!await this._cache.has(uri)) {
            await this.fetch(uri);
        }

        let body = await this._cache.get(uri);

        return load(body, {
            normalizeWhitespace: true,
            decodeEntities: false,
            xmlMode: isXMLFilename(uri)
        });
    }

    async tree(uri: string, indent = 2) {
        let $ = await this.load(uri);
        return toJade($, indent);
    }    
}
