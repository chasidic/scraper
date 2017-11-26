"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("request");
const isXMLFilename_1 = require("./isXMLFilename");
const bufferToString_1 = require("./bufferToString");
const REPLACEMENT_CHAR_REGEX = /\uFFFD/;
const headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
};
async function requestAsync(uri) {
    return new Promise((resolve, reject) => {
        request_1.get(uri, { encoding: null, headers }, (err, res, buffer) => {
            if (err) {
                reject(err.message);
            }
            else if (res.statusCode !== 200) {
                reject(res.statusCode);
            }
            else {
                let cache = bufferToString_1.bufferToString(buffer, isXMLFilename_1.isXMLFilename(uri));
                if (REPLACEMENT_CHAR_REGEX.test(cache)) {
                    reject('corrupted body');
                }
                else {
                    resolve(cache);
                }
            }
        });
    });
}
exports.requestAsync = requestAsync;
;
