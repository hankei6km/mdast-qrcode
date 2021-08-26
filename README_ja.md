# mdast-qrcode

[mdast](https://github.com/syntax-tree/mdast) の画像またはリンクの URL 等を [qrcode](https://www.npmjs.com/package/qrcode) パッケージによって QR code へ変換。

## Install

npm:

```
npm install mdast-qrcode
```

## Usage

### 画像の URL に `qrcode:`

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

### ファイル名が `mdast-qrcode.*` で alt に `qrcode:`

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

### ファイル名が `mdast-qrcode.*` の画像を囲んでいるリンクの URL

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

### ファイル名/ロゴの alt から options を渡す

code:

```typescript
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode';

(async () => {
  const tree = fromMarkdown(
    '# title7\n\n![alt7:qrcode:test7](/path/to/mdast-qrcode-width-250.png)\n\ntext7'
  );
  await toImageDataURL(tree);
  console.log(toMarkdown(tree));
})();
```

yield:

```markdown
# title7

![alt7](data:image/png;base64,iVBORw0KGgoAAAAN ...snip ...=)
text7
```

qrcode options:

- margin: `-margin-<number>`
- scale: `-scale-<number>`
- width: `-width-<number>`
- colorr.light: `-color_light-<RRGGBBAA>` 
- color.dark: `-color_light-<RRGGBBAA>` 

mdqr format options:
- type: `-format_type-<png | jpeg>`
- quality: `-format_quality-<number>` (単位は `%`)


## API

### `toImageDataURL(tree[, options, mdqrOptions])`

[mdast](https://github.com/syntax-tree/mdast) の画像に含まれる "qrcode:" を変換。
画像は `root / paragraph / image` または `root / paragraph / link / image`  階層のみサポートしている。

#### options

options は [QRCode.toDataURL](https://www.npmjs.com/package/qrcode#todataurltext-options-cberror-url-1) へ渡される。

#### mdqrOptions

mdast-qrcode 用のオプション。

#### `format`

QR code を DataURL でエンコードするときのオプション。

##### `type`
 
type: `png` | `jpeg`

default: `png`

##### `quality`
 
type: `number`

default: `0.92`


#### returns

`Promise<MdNode>`

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

## Live Demo

[Live Demo](https://codesandbox.io/s/github/hankei6km/mdast-qrcode-live-demo?file=/slides/slide-deck.md)

1. fork
1. `slides/slide-deck.md` を編集

## License

MIT License

Copyright (c) 2021 hankei6km

QR コードの商標はデンソーウェーブの登録商標です。

