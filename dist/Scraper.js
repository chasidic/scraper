"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const cache_1 = require("@chasidic/cache");
const cheerio_1 = require("cheerio");
const lib_1 = require("./lib");
class Scraper {
    constructor({ cacheDir = null, sleep = 1000, retries = 3 } = {}) {
        this._cache = cacheDir == null ? new cache_1.MemoryCache() : (typeof cacheDir === 'string' ? new cache_1.Cache(cacheDir) : cacheDir);
        this._sleep = sleep;
        this._retries = retries;
    }
    fetch(uri) {
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this._cache.has(uri))) {
                yield this.fetch(uri);
            }
            let body = yield this._cache.get(uri);
            return cheerio_1.load(body, {
                normalizeWhitespace: true,
                decodeEntities: false,
                xmlMode: lib_1.isXMLFilename(uri)
            });
        });
    }
    tree(uri, indent = 2) {
        return __awaiter(this, void 0, void 0, function* () {
            let $ = yield this.load(uri);
            return lib_1.toJade($, indent);
        });
    }
}
exports.Scraper = Scraper;
