"use strict";
/// <reference types="cheerio" />
Object.defineProperty(exports, "__esModule", { value: true });
const IGNORE_ATTRS = new Set(['style']);
let recursiveTree = (root, { INDENT_VALUE, output, indent }) => {
    for (let e of root.children) {
        if (e.type === 'tag') {
            let id = '';
            let classSet = new Set();
            let nameAttrs = [];
            for (let attr in e.attribs) {
                let val = e.attribs[attr];
                if (attr === 'id') {
                    id = '#' + val;
                }
                else if (attr === 'class') {
                    for (let c of val.split(/\s+/))
                        classSet.add('.' + c);
                }
                else if (!attr.startsWith('on') && !IGNORE_ATTRS.has(attr)) {
                    nameAttrs.push({ attr, val });
                }
            }
            let classes = Array.from(classSet).join('');
            let attrs = nameAttrs
                .sort((a, b) => a.attr.localeCompare(b.attr))
                .map(({ attr, val }) => `${attr}="${val}"`)
                .join(' ');
            attrs = attrs ? ` (${attrs})` : '';
            let nextLine = recursiveTree(e, { INDENT_VALUE, output: '', indent: indent + INDENT_VALUE });
            output += `${indent}${e.name}${id}${classes}${attrs}\n${nextLine}`;
        }
    }
    return output;
};
exports.toJade = ($, indent) => {
    let INDENT_VALUE = '';
    while (indent-- > 0)
        INDENT_VALUE += ' ';
    return recursiveTree($.root()[0], { INDENT_VALUE, output: '', indent: '' });
};
