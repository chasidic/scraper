"use strict";
const iconv_1 = require("iconv");
const CHARSET_REGEX_XML = /encoding=["'](.+?)["']/i;
const CHARSET_REGEX_HTML = /charset=["']?(.+?)["']/i;
function bufferToString(buffer, isXML) {
    let body = buffer.toString();
    let match = isXML ? body.match(CHARSET_REGEX_XML) : body.match(CHARSET_REGEX_HTML);
    if (match) {
        let CHARSET = match[1].toUpperCase();
        if (CHARSET !== 'UTF8' && CHARSET !== 'UTF-8') {
            let iconv = new iconv_1.Iconv(CHARSET, 'UTF-8//TRANSLIT//IGNORE');
            body = iconv.convert(buffer).toString();
        }
    }
    return body;
}
exports.bufferToString = bufferToString;
;
