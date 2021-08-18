import { Root, Content, Image, Link } from 'mdast';
import QRCode from 'qrcode';
import { generateQRCode } from './lib/generate';
import { selectTarget } from './lib/select';

const qrcodeInAlt = /(^|(^.*):)qrcode:(.+)$/;
const QRCodeSourcKindeValues = [
  '',
  'image-scheme',
  'image-dummy',
  'link-image-dummy'
] as const;
export type QRCodeSourcKinde = typeof QRCodeSourcKindeValues[number];

export async function byImageScheme(
  tree: Content[],
  options?: QRCode.QRCodeToDataURLOptions
) {
  const image = tree[0] as Image;
  const url: string = image.url || '';
  // as scheme
  const text = url.slice(7); // 'qrcode:'.length = 7
  //const d = await QRCode.toDataURL(text, options);
  const d = await generateQRCode(text);
  image.url = d;
}

export async function byImageDummy(
  tree: Content[],
  options?: QRCode.QRCodeToDataURLOptions
) {
  const image = tree[0] as Image;
  const alt: string = image.alt || '';
  // as alt
  const m = alt.match(qrcodeInAlt);
  if (m && m[3]) {
    //const d = await QRCode.toDataURL(m[3], options);
    const d = await generateQRCode(m[3]);
    image.alt = m[2] || '';
    image.url = d;
  }
}

export async function byLinkImageDummy(
  tree: Content[],
  options?: QRCode.QRCodeToDataURLOptions
) {
  const link = tree[0] as Link;
  const cc = link.children[0];
  if (cc.type === 'image') {
    const image: Image = cc;
    //const d = await QRCode.toDataURL(tree.url, options);
    const d = await generateQRCode(link.url);
    image.url = d;
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
        for (let ii = 0; ii < ll; ii = ii + 1) {
          //const cc: Content[] = [c.children[ii]];
          const [kind, cc] = selectTarget(c.children, ii);

          if (kind === 'image-scheme') {
            await byImageScheme(cc, options);
          } else if (kind === 'image-dummy') {
            await byImageDummy(cc, options);
          } else if (kind === 'link-image-dummy') {
            await byLinkImageDummy(cc, options);
          }
        }
      }
    }
  }
  return tree;
}
