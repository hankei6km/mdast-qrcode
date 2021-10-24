import * as path from 'path';
import { Content, Image } from 'mdast';
import { QRCodeSourcKind } from '../qrcode.js';

const dummyQrcodeFile = 'mdast-qrcode';
export function selectTarget(
  c: Content[],
  idx: number
): { kind: QRCodeSourcKind; qrContent: Content[]; removeIdxs: number[] } {
  const ret: {
    kind: QRCodeSourcKind;
    qrContent: Content[];
    removeIdxs: number[];
  } = {
    kind: '',
    qrContent: [],
    removeIdxs: []
  };
  const top = c[idx];
  if (top.type === 'image') {
    const url: string = top.url || '';
    if (url.startsWith('qrcode:')) {
      // as scheme
      ret.kind = 'image-scheme';
    } else if (path.parse(url).name.startsWith(dummyQrcodeFile)) {
      // as alt
      ret.kind = 'image-dummy';
    }
  } else if (top.type === 'link') {
    const ll = top.children.length;
    if (ll === 1) {
      const cc = top.children[0];
      if (cc.type === 'image') {
        const image: Image = cc;
        const url: string = image.url || '';
        if (path.parse(url).name.startsWith(dummyQrcodeFile)) {
          ret.kind = 'link-image-dummy';
        }
      }
    }
  }
  if (ret.kind !== '') {
    ret.qrContent.push(top);
  }
  return ret;
}
