"use strict";
exports.uniq = (array) => Array.from(new Set(array));
exports.uniqMap = (array) => {
    let map = new Map();
    for (let i of array)
        map.set(i, (map.get(i) || 0) + 1);
    return map;
};
exports.stringArray = (val) => {
    if (typeof val === 'string') {
        return [val];
    }
    else if (Array.isArray(val) && val.every(v => typeof v === 'string')) {
        return val;
    }
    throw new Error('Expected string or an array of strings.');
};
const request_1 = require('request');
const path_1 = require('path');
const REPLACEMENT_CHAR_REGEX = /\uFFFD/;
const CHARSET_REGEX_XML = /encoding=["'](.+?)["']/i;
const CHARSET_REGEX_HTML = /charset=["']?(.+?)["']/i;
exports.isXMLFile = (uri) => path_1.extname(uri) === '.xml';
const bufferToString = (buffer, isXML) => {
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
                let cache = bufferToString(buffer, exports.isXMLFile(uri));
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
function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}
exports.sleep = sleep;
