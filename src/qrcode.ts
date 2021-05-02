import * as path from 'path';
import { Node as MdNode } from 'unist';
//const QRCode = require('qrcode');
import QRCode from 'qrcode';

const qrcodeInAlt = /(^|(^.*):)qrcode:(.+)$/;

export async function toImageDataURL(
  tree: MdNode,
  options?: QRCode.QRCodeToDataURLOptions
): Promise<void> {
  if (tree.type === 'root' && Array.isArray(tree.children)) {
    const l = tree.children.length;
    for (let i = 0; i < l; i++) {
      const c = tree.children[i];
      if (c.type === 'paragraph' && Array.isArray(c.children)) {
        const ll = c.children.length;
        for (let ii = 0; ii < ll; ii++) {
          const cc = c.children[ii];
          //console.log(cc.type);
          if (cc.type === 'image') {
            if (cc.url.startsWith('qrcode:')) {
              // as scheme
              const text = cc.url.slice(7); // 'qrcode:'.length = 7
              const d = await QRCode.toDataURL(text, options);
              cc.url = d;
            } else if (path.parse(cc.url).name === 'qrcode') {
              // as alt
              const m = cc.alt.match(qrcodeInAlt);
              if (m && m[3]) {
                const d = await QRCode.toDataURL(m[3], options);
                cc.alt = m[2] || '';
                cc.url = d;
              }
            }
          }
        }
      }
    }
  }
}
