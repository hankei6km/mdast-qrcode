# mdast-qrcode

convert "qrcode:" to dataURL in image of mdast.

## Instlation

npm:

```
npm install mdast-qrcode
```

## Usage

library

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

CLI

```console
$ cat examples/deck-qrcode.md | md-qr > deck-qrcode-embed.md
```

## License

MIT License

Copyright (c) 2021 hankei6km
