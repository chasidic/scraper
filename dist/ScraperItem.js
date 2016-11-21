"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const cheerio_1 = require("cheerio");
const lib_1 = require("./lib");
class ScraperItem {
    constructor(uri, scraper) {
        this.uri = uri;
        this.scraper = scraper;
        this.$ = null;
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.scraper.cache.has(this.uri))) {
                let retries = 1;
                let error = null;
                do {
                    try {
                        let cache = yield lib_1.requestAsync(this.uri);
                        yield this.scraper.cache.set(this.uri, cache);
                        return;
                    }
                    catch (e) {
                        error = e;
                        yield lib_1.sleep(this.scraper.sleep);
                    }
                } while (++retries < this.scraper.retries);
                throw error;
            }
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.$ == null) {
                if (!(yield this.scraper.cache.has(this.uri))) {
                    yield this.fetch();
                }
                let body = yield this.scraper.cache.get(this.uri);
                this.$ = cheerio_1.load(body, {
                    normalizeWhitespace: true,
                    decodeEntities: false,
                    xmlMode: lib_1.isXMLFilename(this.uri)
                });
            }
            return this.$;
        });
    }
    tree(indent = 2) {
        return __awaiter(this, void 0, void 0, function* () {
            let $ = yield this.load();
            return lib_1.toJade($, indent);
        });
    }
}
exports.ScraperItem = ScraperItem;
