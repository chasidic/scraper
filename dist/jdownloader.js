"use strict";
const tslib_1 = require("tslib");
const request_1 = require("request");
const source = 'NODE';
const headers = { 'content-type': 'application/x-www-form-urlencoded' };
const url = 'http://127.0.0.1:9666/flashgot';
function jdownloader({ uri, pattern = null, packageName = null, }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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