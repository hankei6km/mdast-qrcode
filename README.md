# mdast-qrcode

convert "qrcode:" to dataURL in Image URL/alt of [mdast](https://github.com/syntax-tree/mdast) by using [qrcode](https://www.npmjs.com/package/qrcode).

## Install

npm:

```
npm install mdast-qrcode
```

## Usage

### `qrcode:` in URL

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

###  `qrcode:` in alt with filename is `qrcode.*` 

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

## API

### `toImageDataURL(tree[, options])`

convert "qrcode:" to dataURL in Image URL of [mdast](https://github.com/syntax-tree/mdast).
Images only support `root / paragraph / image` hierarchy.

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
