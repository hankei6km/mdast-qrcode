# mdast-qrcode

convert a URL etc. that contained in Image / Link of [mdast](https://github.com/syntax-tree/mdast) by using [qrcode](https://www.npmjs.com/package/qrcode) package.

## Install

npm:

```
npm install mdast-qrcode
```

## Usage

### `qrcode:` in URL of Image

code:

```typescript
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode';

(async () => {
  const tree = fromMarkdown('# title1\n\n![alt1](qrcode:test1)\ntext1');
  await toImageDataURL(tree);
  console.log(toMarkdown(tree));
})();
```

yield:

```markdown
# title1

![alt1](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAA ...snip ...=)
text1
```

###  `qrcode:` in alt with filename is `mdast-qrcode.*` 

code:

```typescript
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode';

(async () => {
  const tree = fromMarkdown(
    '# title3\n\n![alt3:qrcode:test3](/path/to/mdast-qrcode.png)\ntext3'
  );
  await toImageDataURL(tree);
  console.log(toMarkdown(tree));
})();
```

yield:

```markdown
# title3

![alt3](data:image/png;base64,iVBORw0KGgoAAAA ...snip ...=)
text3
```

### The URL of link that surrounds image with filename is `mdast-qrcode.*` 

code:

```typescript
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode';

(async () => {
  const tree = fromMarkdown(
    '# title5\n\n[![alt5](/path/to/mdast-qrcode.png)](url5)\ntext5'
  );
  await toImageDataURL(tree);
  console.log(toMarkdown(tree));
})();
```

yield:

```markdown
# title5

[![alt5](data:image/png;base64,iVBORw0KGgoAAAAN ...snip ...=)](url5)
text5
```
### Pass options from file name

code:

```typescript
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode';

(async () => {
  const tree = fromMarkdown(
    '# title6\n\n![alt6:qrcode:test6](/path/to/mdast-qrcode-margin-1-width-250.png)\ntext6'
  );
  await toImageDataURL(tree);
  console.log(toMarkdown(tree));
})();
```

yield:

```markdown
# title6

[![alt6](data:image/png;base64,iVBORw0KGgoAAAAN ...snip ...=)](url6)
text6
```

options:

- margin: `-margin-<number>`
- scale: `-scale-<number>`
- width: `-width-<number>`
- colorr.light: `-color-light-<#RRGGBBAA>` 
- color.dark: `-color-light-<#RRGGBBAA>` 

### Overlay logo image by writing logo image after qrcode image

code:

```typescript
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode';

(async () => {
  const tree = fromMarkdown(
    '# title7\n\n[![alt7](/path/to/mdast-qrcode.png)](url7)\n![](https://hankei6km.github.io/logo.png)\ntext7'
  );
  await toImageDataURL(tree);
  console.log(toMarkdown(tree));
})();
```

yield:

```markdown
# title6

[![alt7](data:image/png;base64,iVBORw0KGgoAAAAN ...snip ...=)](url7)
text7
```

## API

### `toImageDataURL(tree[, options])`

convert "qrcode:" to dataURL in Image URL of [mdast](https://github.com/syntax-tree/mdast).
Images only support `root / paragraph / image` or `root / paragraph / link / image`  hierarchy.

If `image` is exist after the QRCode, that` image` will be converted as logo image.

#### options 

Options are passed to [QRCode,toDataURL](https://www.npmjs.com/package/qrcode#todataurltext-options-cberror-url-1).

#### returns

`Promise<MdNode>`

## CLI

```console
$ cat example/qrcode-deck.md  | md-qr > qrcode-embedded-deck.md
```

In addition to `:qrcode` convertion, Markdown string are also affected by [toMarkdown](https://github.com/syntax-tree/mdast-util-to-markdown#tomarkdowntree-options) serialized.


### JSON config file

```json
{
  "toMarkdown": { "bullet": "-", "rule": "-" }
}
```

`toMarkdown.bullet` / `toMarkdown.rule`  field are pass to [toMarkdown](https://github.com/syntax-tree/mdast-util-to-markdown#tomarkdowntree-options).

## Live Demo

[Live Demo](https://codesandbox.io/s/github/hankei6km/mdast-qrcode-live-demo?file=/slides/slide-deck.md)

1. fork
1. edit `slides/slide-deck.md`

## License

MIT License

Copyright (c) 2021 hankei6km
