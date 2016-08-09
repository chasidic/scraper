/// <reference types="cheerio" />

import { mapLimit } from 'async';
import { load } from 'cheerio';
import { Cache } from '@chasidic/cache';
import { IRequestFetcher, isXMLFilename, requestAsync } from './requestAsync';
import { stringArray, sleep, pad } from './common';

export type IScraperNotifier = (uri: string, count: string) => void;

export interface IScraperOptions {
  cacheDir?: string;
  sleep?: number;
  retries?: number;
  notify?: IScraperNotifier;
}

export class Scraper {

  public cache: Cache;
  private _sleep: number;
  private _retries: number;
  private _notify: IScraperNotifier;

  constructor(options: IScraperOptions = {}) {
    this.cache = new Cache(options.cacheDir || null);
    this._sleep = options.sleep || 1000;
    this._retries = options.retries || 3;
    this._notify = options.notify || function() { /* */ };
  }

  private _loadURI(uri: string): Promise<CheerioStatic> {
    return new Promise<CheerioStatic>((resolve, reject) => {
      this.cache.get(uri).then((body) => {
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

    if (await this.cache.has(uri)) {
      fetcher = { success: 'cache', uri };
    } else {
      let retries = 1;
      do {
        fetcher = await requestAsync(uri);
        if (!fetcher.res) {
          await sleep(this._sleep);
        } else {
          break;
        }
      } while (++retries < this._retries);

      if (fetcher.cache) {
        await this.cache.set(uri, fetcher.cache);
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
    const COUNT = uris.length.toString();
    return new Promise<IRequestFetcher[]>((resolve) => {
      let index = 0;
      mapLimit(uris, LIMIT, (uri, next) => {
        this._notify(uri, `${ pad((++index).toString(), COUNT.length, '0') }/${ COUNT }`);
        this._fetcher(uri).then(res => {
          next(null, res);
        });
      }, (err: Error, response: IRequestFetcher[]) => {
        resolve(response);
      });
    });
  }
}
