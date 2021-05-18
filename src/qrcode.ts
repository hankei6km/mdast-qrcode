import * as path from 'path';
import { Root, Image } from 'mdast';
import QRCode from 'qrcode';

const dummyQrcodeFile = 'mdast-qrcode';
const qrcodeInAlt = /(^|(^.*):)qrcode:(.+)$/;

export async function byImage(
  image: Image,
  options?: QRCode.QRCodeToDataURLOptions
) {
  const url: string = image.url || '';
  const alt: string = image.alt || '';
  if (url.startsWith('qrcode:')) {
    // as scheme
    const text = url.slice(7); // 'qrcode:'.length = 7
    const d = await QRCode.toDataURL(text, options);
    image.url = d;
  } else if (path.parse(url).name === dummyQrcodeFile) {
    // as alt
    const m = alt.match(qrcodeInAlt);
    if (m && m[3]) {
      const d = await QRCode.toDataURL(m[3], options);
      image.alt = m[2] || '';
      image.url = d;
    }
  }
}

export async function toImageDataURL(
  tree: Root,
  options?: QRCode.QRCodeToDataURLOptions
): Promise<Root> {
  if (tree.type === 'root') {
    const l = tree.children.length;
    for (let i = 0; i < l; i++) {
      const c = tree.children[i];
      if (c.type === 'paragraph') {
        const ll = c.children.length;
        for (let ii = 0; ii < ll; ii++) {
          const cc = c.children[ii];
          if (cc.type === 'image') {
            await byImage(cc, options);
          }
        }
      }
    }
  }
  return tree;
}
