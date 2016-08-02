"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const async_1 = require('async');
const cheerio_1 = require('cheerio');
const cache_1 = require('@chasidic/cache');
const common_1 = require('./common');
class Request {
    constructor() {
        this.cache = new cache_1.Cache();
    }
    _loadURI(uri) {
        return new Promise((resolve, reject) => {
            this.cache.get(uri).then((body) => {
                if (body) {
                    let $ = cheerio_1.load(body, {
                        normalizeWhitespace: true,
                        decodeEntities: false,
                        xmlMode: common_1.isXMLFile(uri)
                    });
                    resolve($);
                }
                else {
                    reject(null);
                }
            });
        });
    }
    _fetcher(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            let fetcher;
            if (yield this.cache.has(uri)) {
                fetcher = { success: 'cache', uri };
            }
            else {
                let retries = 10;
                do {
                    fetcher = yield common_1.requestAsync(uri);
                    if (!fetcher.res)
                        yield common_1.sleep(1000);
                    else
                        break;
                } while (--retries > 0);
                if (fetcher.cache) {
                    yield this.cache.set(uri, fetcher.cache);
                    delete fetcher.cache;
                }
                else {
                }
            }
            return fetcher;
        });
    }
    get(url, LIMIT = 5) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetch(url, LIMIT).then((res) => Promise.all(res
                .filter(d => !!d.success)
                .map(d => this._loadURI(d.uri))));
        });
    }
    fetch(url, LIMIT = 5) {
        return __awaiter(this, void 0, void 0, function* () {
            let uris = common_1.stringArray(url);
            return new Promise((resolve) => {
                async_1.mapLimit(uris, LIMIT, (uri, next) => {
                    this._fetcher(uri).then(res => {
                        next(null, res);
                    });
                }, (err, response) => {
                    resolve(response);
                });
            });
        });
    }
}
exports.Request = Request;
