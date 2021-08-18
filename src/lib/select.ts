import * as path from 'path';
import { Content, Image } from 'mdast';
import { QRCodeSourcKind } from '../qrcode';

const dummyQrcodeFile = 'mdast-qrcode';

export function selectTarget(
  c: Content[],
  idx: number
): [QRCodeSourcKind, Content[]] {
  const ret: [QRCodeSourcKind, Content[]] = ['', []];
  const top = c[idx];
  if (top.type === 'image') {
    const url: string = top.url || '';
    if (url.startsWith('qrcode:')) {
      // as scheme
      ret[0] = 'image-scheme';
    } else if (path.parse(url).name === dummyQrcodeFile) {
      // as alt
      ret[0] = 'image-dummy';
    }
  } else if (top.type === 'link') {
    const ll = top.children.length;
    if (ll === 1) {
      const cc = top.children[0];
      if (cc.type === 'image') {
        const image: Image = cc;
        const url: string = image.url || '';
        if (path.parse(url).name === dummyQrcodeFile) {
          ret[0] = 'link-image-dummy';
        }
      }
    }
  }
  if (ret[0] !== '') {
    ret[1].push(top);
    //   console.log('----');
    //   const clen = c.length - 1;
    //   for (let i = idx; i < clen; i++) {
    //     console.log(c[i]);
    //   }
    //   console.log('====');
  }
  return ret;
}
