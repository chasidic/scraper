import { load } from 'cheerio';
import { Scraper } from './Scraper';
import { isXMLFilename, requestAsync, sleep, toJade } from './lib';

export class ScraperItem {

    private $: CheerioStatic = null;

    constructor(public uri: string, private scraper: Scraper) { }

    async fetch() {
        if (!await this.scraper.cache.has(this.uri)) {
            let retries = 1;
            let error: Error = null;

            do {
                try {
                    let cache = await requestAsync(this.uri);
                    await this.scraper.cache.set(this.uri, cache);
                    return;
                } catch (e) {
                    error = e;
                    await sleep(this.scraper.sleep);
                }
            } while (++retries < this.scraper.retries);

            throw error;
        }
    }

    async load() {
        if (this.$ == null) {
            if (!await this.scraper.cache.has(this.uri)) {
                await this.fetch();
            }

            let body = await this.scraper.cache.get(this.uri);

            this.$ = load(body, {
                normalizeWhitespace: true,
                decodeEntities: false,
                xmlMode: isXMLFilename(this.uri)
            });
        }

        return this.$;
    }

    async tree(indent = 2) {
        let $ = await this.load();
        return toJade($, indent);
    }
}
