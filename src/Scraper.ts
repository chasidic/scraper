import { Cache, MemoryCache } from '@chasidic/cache';
import { DOMParser, Options } from 'xmldom';
import { load } from 'cheerio';
import { isXMLFilename, requestAsync, sleep, toJade } from './lib';

export class Scraper {
    private _cache: Cache<string> | MemoryCache;
    private _sleep: number;
    private _retries: number;

    constructor({ cache = null, sleep = 1000, retries = 3 }: {
        cache?: string | Cache<string> | MemoryCache;
        sleep?: number;
        retries?: number;
    } = {}) {

        this._cache = cache == null ? new MemoryCache() : (typeof cache === 'string' ? new Cache(cache) : cache);
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
        await this.fetch(uri);
        return await this._cache.get(uri);
    }

    async loadDOM(uri: string, options: Options = {}) {
        const body = await this.load(uri);
        const parser = new DOMParser(options);
        return parser.parseFromString(body, 'text/xml');
    }

    async loadCheerio(uri: string) {
        const body = await this.load(uri);
        const normalizeWhitespace = true;
        const decodeEntities = false;
        const xmlMode = isXMLFilename(uri);
        return load(body, { normalizeWhitespace, decodeEntities, xmlMode });
    }

    async tree(uri: string, indent = 2) {
        let $ = await this.loadCheerio(uri);
        return toJade($, indent);
    }
}
