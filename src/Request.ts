import { mapLimit } from 'async';
import { load } from 'cheerio';
import { Cache } from '@chasidic/cache';

import {
  stringArray,
  requestAsync,
  IFetcher,
  isXMLFile,
  sleep
} from './common';

export class Request {

  private cache = new Cache();

  private _loadURI(uri: string): Promise<CheerioStatic> {
    return new Promise<CheerioStatic>((resolve, reject) => {
      this.cache.get(uri).then((body) => {
        if (body) {
          let $ = load(body, {
            normalizeWhitespace: true,
            decodeEntities: false,
            xmlMode: isXMLFile(uri)
          });

          resolve($);
        } else {
          reject(null);
        }
      });
    });
  }

  private async _fetcher(uri: string): Promise<IFetcher> {

    let fetcher: IFetcher;

    if (await this.cache.has(uri)) {
      fetcher = { success: 'cache', uri };
    } else {

      let retries = 10;
      do {
        fetcher = await requestAsync(uri);
        if (!fetcher.res)
          await sleep(1000);
        else
          break;
      } while (--retries > 0);

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

  async fetch(url: string | string[], LIMIT = 5): Promise<IFetcher[]> {
    let uris = stringArray(url);
    return new Promise<IFetcher[]>((resolve) => {
      mapLimit(uris, LIMIT, (uri, next) => {
        this._fetcher(uri).then(res => {
          next(<Error> <any> null, res);
        });
      }, (err: Error, response: IFetcher[]) => {
        resolve(response);
      });
    });
  }
}
