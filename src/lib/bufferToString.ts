import { Iconv } from 'iconv';

const CHARSET_REGEX_XML = /encoding=["'](.+?)["']/i;
const CHARSET_REGEX_HTML = /charset=["']?(.+?)["']/i;

export function bufferToString(buffer: Buffer | string, isXML: boolean) {
  let body = buffer.toString();
  let regex = isXML ? CHARSET_REGEX_XML : CHARSET_REGEX_HTML;
  let match = body.match(regex);

  if (match) {
    let CHARSET = match[1].toUpperCase();
    if (CHARSET !== 'UTF8' && CHARSET !== 'UTF-8') {
      let iconv = new Iconv(CHARSET, 'UTF-8//TRANSLIT//IGNORE');
      body = iconv.convert(buffer).toString();
    }
  }

  return body;
};
