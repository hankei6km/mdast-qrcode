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

### 画像の連続記述でロゴを重ねる

code:

```typescript
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode';

(async () => {
  const tree = fromMarkdown(
    '# title6\n\n[![alt6](/path/to/mdast-qrcode.png)](url6)\n![](https://hankei6km.github.io/logo.png)\ntext6'
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

### ファイル名/ロゴの alt から options を渡す

code:

```typescript
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode';

(async () => {
  const tree = fromMarkdown(
    '# title7\n\n![alt7:qrcode:test7](/path/to/mdast-qrcode-width-250.png)\n\n![logo_fillstyle-FF0000FF](https://hankei6km.github.io/logo.png)text7'
  );
  await toImageDataURL(tree);
  console.log(toMarkdown(tree));
})();
```

yield:

```markdown
# title7

[![alt7](data:image/png;base64,iVBORw0KGgoAAAAN ...snip ...=)](url7)
text6
```

qrcode options:

- margin: `-margin-<number>`
- scale: `-scale-<number>`
- width: `-width-<number>`
- colorr.light: `-color_light-<RRGGBBAA>` 
- color.dark: `-color_light-<RRGGBBAA>` 

mdqr logo options:

- position: `-logo_position-<center | right-bottom>`
- fillstyle: `-logo_fillstyle-<<RRGGBBAA>>`
- fillshape: `-logo_fillshape-<circle | rect>>`
- margin: `-logo_margin-<number>`
- paddinfg: `-logo_padding-<number>`
- fit: `-logo_fit-<number>`
- query: `-logo_query-<string>` (オプション文字列全体の末尾に指定)

mdqr format options:
- type: `-format_type-<png | jpeg>`
- quality: `-format_quality-<number>` (単位は `%`)


## API

### `toImageDataURL(tree[, options, mdqrOptions])`

[mdast](https://github.com/syntax-tree/mdast) の画像に含まれる "qrcode:" を変換。
画像は `root / paragraph / image` または `root / paragraph / link / image`  階層のみサポートしている。

QRCode の直後に `image` がある場合、その `image` はロゴ画像として扱われる。


#### options

options は [QRCode.toDataURL](https://www.npmjs.com/package/qrcode#todataurltext-options-cberror-url-1) へ渡される。

#### mdqrOptions

mdast-qrcode 用のオプション。

##### logo

logo を重ねるときのオプション。

###### `position`

 `center` | `right-bottom`  

deault: `center`

###### `fillstyle`

 `#RRGGBBAA`

deault: `#FFFFFFFF`

###### `fillshape`

 `circle` | `rect`

deault: `circle`

###### `margin`

 `<number>`

default: `55`

###### `padding`

 `<number>`

default: `4`

###### `fit`

`<number>`

QRCode の幅に対する比率(単位は `%`)。 `0` を渡すと無効化。

default: `35`

###### `query`

`<string>`

logo image ni

ロゴ画像の URL に付加される文字列。

#### `format`

QR code を DataURL でエンコードするときのオプション。

##### `type`
 
  `png` | `jpeg`

default: `png`

##### `quality`
 
  `number`

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

QRコードの商標はデンソーウェーブの登録商標です
