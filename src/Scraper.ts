/// <reference types="cheerio" />

import { mapLimit } from 'async';
import { load } from 'cheerio';
import { Cache } from '@chasidic/cache';
import { IRequestFetcher, isXMLFilename, requestAsync } from './requestAsync';
import { stringArray, sleep } from './common';

export interface IScraperOptions {
  cacheDir?: string;
  sleep?: number;
  retries?: number;
}

export class Scraper {

  private _cache: Cache;
  private _sleep: number;
  private _retries: number;

  constructor(options: IScraperOptions = {}) {
    this._cache = new Cache(options.cacheDir || null);
    this._sleep = options.sleep || 1000;
    this._retries = options.retries || 3;
  }

  private _loadURI(uri: string): Promise<CheerioStatic> {
    return new Promise<CheerioStatic>((resolve, reject) => {
      this._cache.get(uri).then((body) => {
        if (body) {
          let $ = load(body, {
            normalizeWhitespace: true,
            decodeEntities: false,
            xmlMode: isXMLFilename(uri)
          });

          resolve($);
        } else {
          reject(null);
        }
      });
    });
  }

  private async _fetcher(uri: string): Promise<IRequestFetcher> {

    let fetcher: IRequestFetcher;

    if (await this._cache.has(uri)) {
      fetcher = { success: 'cache', uri };
    } else {

      let retries = this._retries;
      do {
        fetcher = await requestAsync(uri);
        if (!fetcher.res)
          await sleep(this._sleep);
        else
          break;
      } while (--retries > 0);

      if (fetcher.cache) {
        await this._cache.set(uri, fetcher.cache);
        delete fetcher.cache;
      } else {
        // await this.cache.setError(uri, fetcher.err);
      }

    }

    return fetcher;
  }

  async get(url: string | string[], LIMIT = 5): Promise<CheerioStatic[]> {
    return this.fetch(url, LIMIT).then((res) =>
      Promise.all(res
        .filter(d => !!d.success)
        .map(d => this._loadURI(d.uri))
      )
    );
  }

  async fetch(url: string | string[], LIMIT = 5): Promise<IRequestFetcher[]> {
    let uris = stringArray(url);
    return new Promise<IRequestFetcher[]>((resolve) => {
      mapLimit(uris, LIMIT, (uri, next) => {
        this._fetcher(uri).then(res => {
          next(<Error> <any> null, res);
        });
      }, (err: Error, response: IRequestFetcher[]) => {
        resolve(response);
      });
    });
  }
}
