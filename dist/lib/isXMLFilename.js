"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.isXMLFilename = (uri) => path_1.extname(uri) === '.xml';
