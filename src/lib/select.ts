import * as path from 'path';
import { Content, Image } from 'mdast';
import { QRCodeSourcKind } from '../qrcode';

const dummyQrcodeFile = 'mdast-qrcode';

export function validLogoImageURL(url: string): boolean {
  try {
    const protocol = new URL(url).protocol;
    switch (protocol) {
      case 'http:':
      case 'https:':
      case 'data:':
        return true;
    }
  } catch (err) {
    return false;
  }
  return false;
}

export function pickLogo(c: Content[], idx: number): number[] {
  const clen = c.length;
  if (idx + 1 < clen) {
    if (
      c[idx + 1].type === 'image' &&
      validLogoImageURL((c[idx + 1] as Image).url || '')
    ) {
      return [idx + 1];
    }
  }
  if (idx + 2 < clen) {
    if (
      c[idx + 1].type === 'text' &&
      c[idx + 1].value === '\n' &&
      c[idx + 2].type === 'image' &&
      validLogoImageURL((c[idx + 2] as Image).url || '')
    ) {
      return [idx + 1, idx + 2];
    }
  }
  return [];
}

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
    } else if (path.parse(url).name === dummyQrcodeFile) {
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
        if (path.parse(url).name === dummyQrcodeFile) {
          ret.kind = 'link-image-dummy';
        }
      }
    }
  }
  if (ret.kind !== '') {
    ret.qrContent.push(top);
    const logoIdxs = pickLogo(c, idx);
    const llen = logoIdxs.length;
    if (llen > 0) {
      ret.qrContent.push(c[logoIdxs[llen - 1]]);
      ret.removeIdxs = logoIdxs;
    }
  }
  return ret;
}
