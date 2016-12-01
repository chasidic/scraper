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
const source = 'NODE';
const headers = { 'content-type': 'application/x-www-form-urlencoded' };
const url = 'http://127.0.0.1:9666/flashgot';
function jdownloader({ uri, pattern = null, packageName = null, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const urls = typeof uri === 'string' ? uri : uri.join(',');
        let form = { urls, source };
        if (pattern != null)
            form.fnames = pattern;
        if (packageName != null)
            form.package = packageName;
        return new Promise((resolve, reject) => {
            request_1.post({ headers, url, form }, (err, response, body) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(response.statusCode);
                }
            });
        });
    });
}
exports.jdownloader = jdownloader;
