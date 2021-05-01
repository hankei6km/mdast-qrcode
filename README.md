# mdast-qrcode

convert "qrcode:" to dataURL in Image URL of [mdast](https://github.com/syntax-tree/mdast) by using [qrcode](https://www.npmjs.com/package/qrcode).

## Install

npm:

```
npm install mdast-qrcode
```

## Usage

code:

```typescript
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode';

(async () => {
  const tree = fromMarkdown('# test1\n\n![](qrcode:test1)\ntest1');
  await toImageDataURL(tree);
  console.log(toMarkdown(tree));
})();
```

yield:

```markdown
# test1

![](data:image/png;base64,iVBORw0KGgoAAAANSU ...snip ...=)
test1
```

## API

### `toImageDataURL(tree[, options])`

convert "qrcode:" to dataURL in Image URL of [mdast](https://github.com/syntax-tree/mdast).
Images only support `root / paragraph / image` hierarchy.

#### options 

Options are passed to [QRCode,toDataURL](https://www.npmjs.com/package/qrcode#todataurltext-options-cberror-url-1).

#### returns

`Promise<void>`

## CLI

```console
$ cat example/qrcode-deck.md  | md-qr > qrcode-embedded-deck.md
```

### JSON config file

```json
{
  "toMarkdown": { "bullet": "-", "rule": "-" }
}
```

`toMarkdown.bullet` / `toMarkdown.rule`  field are pass to [toMarkdown](https://github.com/syntax-tree/mdast-util-to-markdown#tomarkdowntree-options).


## License

MIT License

Copyright (c) 2021 hankei6km
