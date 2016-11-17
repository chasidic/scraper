"use strict";
const path_1 = require("path");
const request_1 = require("request");
const iconv_1 = require("iconv");
exports.isXMLFilename = (uri) => path_1.extname(uri) === '.xml';
const REPLACEMENT_CHAR_REGEX = /\uFFFD/;
const CHARSET_REGEX_XML = /encoding=["'](.+?)["']/i;
const CHARSET_REGEX_HTML = /charset=["']?(.+?)["']/i;
const bufferToString = (buffer, isXML) => {
    let body = buffer.toString();
    let match = isXML ?
        body.match(CHARSET_REGEX_XML) :
        body.match(CHARSET_REGEX_HTML);
    if (match) {
        let CHARSET = match[1].toUpperCase();
        if (CHARSET !== 'UTF8' && CHARSET !== 'UTF-8') {
            let iconv = new iconv_1.Iconv(CHARSET, 'UTF-8//TRANSLIT//IGNORE');
            body = iconv.convert(buffer).toString();
        }
    }
    return body;
};
exports.requestAsync = (uri) => {
    return new Promise((resolve, reject) => {
        request_1.get(uri, { encoding: null }, (err, res, buffer) => {
            if (err) {
                resolve({ err: err.message, uri });
            }
            else if (res.statusCode !== 200) {
                resolve({ err: res.statusCode, uri, res });
            }
            else {
                let cache = bufferToString(buffer, exports.isXMLFilename(uri));
                if (REPLACEMENT_CHAR_REGEX.test(cache)) {
                    resolve({ uri, err: 'corrupted body', res });
                }
                else {
                    resolve({ success: 'fetch', uri, cache, res });
                }
            }
        });
    });
};
