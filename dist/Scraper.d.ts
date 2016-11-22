/// <reference types="cheerio" />
export declare class Scraper {
    private _cache;
    private _sleep;
    private _retries;
    constructor({cacheDir, sleep, retries}?: {
        cacheDir?: string;
        sleep?: number;
        retries?: number;
    });
    fetch(uri: string): Promise<void>;
    load(uri: string): Promise<CheerioStatic>;
    tree(uri: string, indent?: number): Promise<string>;
}
