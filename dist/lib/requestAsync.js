"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const request_1 = require("request");
const isXMLFilename_1 = require("./isXMLFilename");
const bufferToString_1 = require("./bufferToString");
const REPLACEMENT_CHAR_REGEX = /\uFFFD/;
function requestAsync(uri) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            request_1.get(uri, { encoding: null }, (err, res, buffer) => {
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
    });
}
exports.requestAsync = requestAsync;
;
