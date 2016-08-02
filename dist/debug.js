"use strict";
const tty_1 = require('tty');
const readline_sync_1 = require('readline-sync');
const DELIMITER = ', ';
const SPACE = ' ';
exports.debug = (...args) => {
    let fd = process.stdout.fd;
    if (!tty_1.isatty(fd)) {
        console.log(`\nERROR: not a tty (process.stdout.fd === ${fd})\n`);
        process.exit(0);
    }
    process.stdout.write(args.join(DELIMITER) + SPACE);
    readline_sync_1.default.prompt();
};
