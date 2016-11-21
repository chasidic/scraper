"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const request_1 = require("request");
const isXMLFilename_1 = require("./isXMLFilename");
const bufferToString_1 = require("./bufferToString");
const REPLACEMENT_CHAR_REGEX = /\uFFFD/;
function requestAsync(uri) {
    return __awaiter(this, void 0, void 0, function* () {
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
