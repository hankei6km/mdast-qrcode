# mdast-qrcode

[mdast](https://github.com/syntax-tree/mdast) の Image URL に含まれる "qrcode:" を [qrcode](https://www.npmjs.com/package/qrcode) によって変換。

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

[dast](https://github.com/syntax-tree/mdast) の画像 URL に含まれる "qrcode:" を変換。
画像は `root / paragraph / image` 階層のみサポートしている。

#### options`

options は [QRCode,toDataURL](https://www.npmjs.com/package/qrcode#todataurltext-options-cberror-url-1) へ渡される。

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

`toMarkdown.bullet` / `toMarkdown.rule` フィールドは [toMarkdown](https://github.com/syntax-tree/mdast-util-to-markdown#tomarkdowntree-options) へ渡される。


## License

MIT License

Copyright (c) 2021 hankei6km
