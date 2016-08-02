import { get } from 'request';
import { extname } from 'path';
import { Iconv } from 'iconv';

export const uniq = <T>(array: T[]) => Array.from(new Set(array));

export const uniqMap = <T>(array: T[]) => {
  let map = new Map<T, number>();
  for (let i of array) map.set(i, (map.get(i) || 0) + 1);
  return map;
};

export const stringArray = (val: string | string[]): string[] => {
  if (typeof val === 'string') {
    return [val];
  } else if (Array.isArray(val) && val.every(v => typeof v === 'string')) {
    return val;
  }

  throw new Error('Expected string or an array of strings.');
};

export function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}

export interface IFetcher {
  uri: string;
  err?: any;
  res?: any;
  success?: 'cache' | 'fetch';
  cache?: string;
}

const REPLACEMENT_CHAR_REGEX = /\uFFFD/;
const CHARSET_REGEX_XML = /encoding=["'](.+?)["']/i;
const CHARSET_REGEX_HTML = /charset=["']?(.+?)["']/i;

export const isXMLFile = (uri: string) => extname(uri) === '.xml';

const bufferToString = (buffer: Buffer | string, isXML: boolean) => {
  let body = buffer.toString();
  let match = isXML ?
    body.match(CHARSET_REGEX_XML) :
    body.match(CHARSET_REGEX_HTML);

  if (match) {
    let CHARSET = match[1].toUpperCase();
    if (CHARSET !== 'UTF8' && CHARSET !== 'UTF-8') {
      let iconv = new Iconv(CHARSET, 'UTF-8//TRANSLIT//IGNORE');
      body = iconv.convert(buffer).toString();
    }
  }
  return body;
};

export const requestAsync = (uri: string) => {
  return new Promise<IFetcher>((resolve, reject) => {
    get(uri, { encoding: null }, (err, res, buffer) => {
      if (err) {
        resolve({ err: err.message, uri });
      } else if (res.statusCode !== 200) {
        resolve({ err: res.statusCode, uri, res });
      } else {
        let cache = bufferToString(buffer, isXMLFile(uri));
        if (REPLACEMENT_CHAR_REGEX.test(cache)) {
          resolve({ uri, err: 'corrupted body', res });
        } else {
          resolve({ success: 'fetch', uri, cache, res });
        }
      }
    });
  });
};
