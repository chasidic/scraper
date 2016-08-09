import { extname } from 'path';
import { get } from 'request';
import { Iconv } from 'Iconv';

export interface IRequestFetcher {
  uri: string;
  err?: any;
  res?: any;
  success?: 'cache' | 'fetch';
  cache?: string;
}

export const isXMLFilename = (uri: string) => extname(uri) === '.xml';

const REPLACEMENT_CHAR_REGEX = /\uFFFD/;
const CHARSET_REGEX_XML = /encoding=["'](.+?)["']/i;
const CHARSET_REGEX_HTML = /charset=["']?(.+?)["']/i;

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
  return new Promise<IRequestFetcher>((resolve, reject) => {
    get(uri, { encoding: null }, (err, res, buffer) => {
      if (err) {
        resolve({ err: err.message, uri });
      } else if (res.statusCode !== 200) {
        resolve({ err: res.statusCode, uri, res });
      } else {
        let cache = bufferToString(buffer, isXMLFilename(uri));
        if (REPLACEMENT_CHAR_REGEX.test(cache)) {
          resolve({ uri, err: 'corrupted body', res });
        } else {
          resolve({ success: 'fetch', uri, cache, res });
        }
      }
    });
  });
};
