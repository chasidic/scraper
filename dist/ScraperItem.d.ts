/// <reference types="bluebird" />
/// <reference types="cheerio" />
import { Scraper } from './Scraper';
export declare class ScraperItem {
    uri: string;
    private scraper;
    private $;
    constructor(uri: string, scraper: Scraper);
    fetch(): Promise<void>;
    load(): Promise<CheerioStatic>;
    tree(indent?: number): Promise<string>;
}
