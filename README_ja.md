# mdast-qrcode

[mdast](https://github.com/syntax-tree/mdast) の Image URL または alt に含まれる "qrcode:" を [qrcode](https://www.npmjs.com/package/qrcode) によって変換。

## Install

npm:

```
npm install mdast-qrcode
```

## Usage

### URL に `qrcode:`

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

### ファイル名が `qrcode.*` で alt に `qrcode:`

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

[dast](https://github.com/syntax-tree/mdast) の画像に含まれる "qrcode:" を変換。
画像は `root / paragraph / image` 階層のみサポートしている。

#### options`

options は [QRCode,toDataURL](https://www.npmjs.com/package/qrcode#todataurltext-options-cberror-url-1) へ渡される。

#### returns

`Promise<void>`

## CLI

```console
$ cat example/qrcode-deck.md  | md-qr > qrcode-embedded-deck.md
```

なお、出力される markdown 文字列は、`:qrcode` 変換以外も to-markdown の変換に影響される。

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
