"use strict";
const tslib_1 = require("tslib");
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
    fetch(uri) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(yield this._cache.has(uri))) {
                let retries = 1;
                let error = null;
                do {
                    try {
                        let cache = yield lib_1.requestAsync(uri);
                        yield this._cache.set(uri, cache);
                        return;
                    }
                    catch (e) {
                        error = e;
                        yield lib_1.sleep(this._sleep);
                    }
                } while (++retries < this._retries);
                throw error;
            }
        });
    }
    load(uri) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.fetch(uri);
            return yield this._cache.get(uri);
        });
    }
    loadDOM(uri, options = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const body = yield this.load(uri);
            const parser = new xmldom_1.DOMParser(options);
            return parser.parseFromString(body, 'text/xml');
        });
    }
    loadCheerio(uri) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const body = yield this.load(uri);
            const normalizeWhitespace = true;
            const decodeEntities = false;
            const xmlMode = lib_1.isXMLFilename(uri);
            return cheerio_1.load(body, { normalizeWhitespace, decodeEntities, xmlMode });
        });
    }
    tree(uri, indent = 2) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let $ = yield this.loadCheerio(uri);
            return lib_1.toJade($, indent);
        });
    }
}
exports.Scraper = Scraper;
