/// <reference types="cheerio" />

const IGNORE_ATTRS = new Set([ 'style' ]);

interface IOptions {
  INDENT_VALUE: string;
  output: string;
  indent: string;
}

let recursiveTree = (root: CheerioElement, { INDENT_VALUE, output, indent }: IOptions): string => {
  for (let e of root.children) {
    if (e.type === 'tag') {
      let id = '';
      let classSet = new Set();
      let nameAttrs: { attr: string; val: string; }[] = [];

      for (let attr in e.attribs) {
        let val = e.attribs[attr];
        if (attr === 'id') {
          id = '#' + val;
        } else if (attr === 'class') {
          for (let c of val.split(/\s+/)) classSet.add('.' + c);
        } else if (!attr.startsWith('on') && !IGNORE_ATTRS.has(attr)) {
          nameAttrs.push({ attr, val });
        }
      }

      let classes = Array.from(classSet).join('');

      let attrs = nameAttrs
        .sort((a, b) => a.attr.localeCompare(b.attr))
        .map(({ attr, val }) => `${ attr }="${ val }"`)
        .join(' ');

      attrs = attrs ? ` (${ attrs })` : '';

      let nextLine = recursiveTree(e, { INDENT_VALUE, output: '', indent: indent + INDENT_VALUE });
      output += `${ indent }${ e.name }${ id }${ classes }${ attrs }\n${ nextLine }`;
    }
  }
  return output;
};

export let toJade = ($: CheerioStatic, indent: number) => {
  let INDENT_VALUE = '';
  while (indent-- > 0) INDENT_VALUE += ' ';
  return recursiveTree($.root()[0], { INDENT_VALUE, output: '', indent: '' });
};
