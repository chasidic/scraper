"use strict";
function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}
exports.sleep = sleep;
