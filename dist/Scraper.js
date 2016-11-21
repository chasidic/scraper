"use strict";
const cache_1 = require("@chasidic/cache");
const ScraperItem_1 = require("./ScraperItem");
class Scraper {
    constructor({ cacheDir = null, sleep = 1000, retries = 3 } = {}) {
        this._cache = new cache_1.Cache(cacheDir);
        this._sleep = sleep;
        this._retries = retries;
    }
    get cache() { return this._cache; }
    get sleep() { return this._sleep; }
    get retries() { return this._retries; }
    create(url) {
        return new ScraperItem_1.ScraperItem(url, this);
    }
}
exports.Scraper = Scraper;
