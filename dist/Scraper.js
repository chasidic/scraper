"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("@chasidic/cache");
const xmldom_1 = require("xmldom");
const cheerio_1 = require("cheerio");
const lib_1 = require("./lib");
class Scraper {
    constructor({ cache = null, sleep = 1000, retries = 3 } = {}) {
        this._cache = cache == null ? new cache_1.MemoryCache() : (typeof cache === 'string' ? new cache_1.Cache(cache) : cache);
        this._sleep = sleep;
        this._retries = retries;
    }
    async fetch(uri) {
        if (!await this._cache.has(uri)) {
            let retries = 1;
            let error = null;
            do {
                try {
                    let cache = await lib_1.requestAsync(uri);
                    await this._cache.set(uri, cache);
                    return;
                }
                catch (e) {
                    error = e;
                    await lib_1.sleep(this._sleep);
                }
            } while (++retries < this._retries);
            throw error;
        }
    }
    async load(uri) {
        await this.fetch(uri);
        return await this._cache.get(uri);
    }
    async loadDOM(uri, options = {}) {
        const body = await this.load(uri);
        const parser = new xmldom_1.DOMParser(options);
        return parser.parseFromString(body, 'text/xml');
    }
    async loadCheerio(uri) {
        const body = await this.load(uri);
        const normalizeWhitespace = true;
        const decodeEntities = false;
        const xmlMode = lib_1.isXMLFilename(uri);
        return cheerio_1.load(body, { normalizeWhitespace, decodeEntities, xmlMode });
    }
    async tree(uri, indent = 2) {
        let $ = await this.loadCheerio(uri);
        return lib_1.toJade($, indent);
    }
}
exports.Scraper = Scraper;
