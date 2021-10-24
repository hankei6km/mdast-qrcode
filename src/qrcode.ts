import { Root, Content, Image, Link } from 'mdast';
import QRCode from 'qrcode';
import { generateQRCode } from './lib/generate.js';
import { decodeOptions } from './lib/options.js';
import { selectTarget } from './lib/select.js';
import { getFileNameFromURL } from './lib/util.js';

const qrcodeInAlt = /(^|(^.*):)qrcode:(.+)$/;
const QRCodeSourcKindValues = [
  '',
  'image-scheme',
  'image-dummy',
  'link-image-dummy'
] as const;
export type QRCodeSourcKind = typeof QRCodeSourcKindValues[number];
export type MdqrOptions = {};
export const mdqrOptionsDefaults: Required<MdqrOptions> = {};

export async function byImageScheme(
  tree: Content[],
  options?: QRCode.QRCodeToDataURLOptions,
  logoOptions?: MdqrOptions
) {
  const image = tree[0] as Image;
  const url: string = image.url || '';
  // as scheme
  const text = url.slice(7); // 'qrcode:'.length = 7
  const d = await generateQRCode(text, options);
  image.url = d;
}

export async function byImageDummy(
  tree: Content[],
  options?: QRCode.QRCodeToDataURLOptions,
  mdqrOptions?: MdqrOptions
) {
  const image = tree[0] as Image;
  const alt: string = image.alt || '';
  // as alt
  const m = alt.match(qrcodeInAlt);
  if (m && m[3]) {
    //const d = await QRCode.toDataURL(m[3], options);
    const fileName = getFileNameFromURL(image.url);
    const d = await generateQRCode(
      m[3],
      ...decodeOptions(options || {}, mdqrOptions || {}, [fileName])
    );
    image.alt = m[2] || '';
    image.url = d;
  }
}

export async function byLinkImageDummy(
  tree: Content[],
  options?: QRCode.QRCodeToDataURLOptions,
  mdqrOptions?: MdqrOptions
) {
  const link = tree[0] as Link;
  const cc = link.children[0];
  if (cc.type === 'image') {
    const image: Image = cc;
    //const d = await QRCode.toDataURL(tree.url, options);
    const fileName = getFileNameFromURL(image.url);
    const d = await generateQRCode(
      link.url,
      ...decodeOptions(options || {}, mdqrOptions || {}, [fileName])
    );
    image.url = d;
  }
}

export function addRemoveIdxs(r: number[], a: number[]) {
  a.forEach((i) => {
    if (!r.includes(i)) {
      r.push(i);
    }
  });
}

export async function toImageDataURL(
  tree: Root,
  options?: QRCode.QRCodeToDataURLOptions,
  mdqrOptions: MdqrOptions = {}
): Promise<Root> {
  if (tree.type === 'root') {
    const l = tree.children.length;
    for (let i = 0; i < l; i++) {
      const c = tree.children[i];
      if (c.type === 'paragraph') {
        const removeIdxs: number[] = [];
        const ll = c.children.length;
        for (let ii = 0; ii < ll; ii = ii + 1) {
          //const cc: Content[] = [c.children[ii]];
          const targetInfo = selectTarget(c.children, ii);

          if (targetInfo.kind === 'image-scheme') {
            await byImageScheme(targetInfo.qrContent, options, mdqrOptions);
            addRemoveIdxs(removeIdxs, targetInfo.removeIdxs);
          } else if (targetInfo.kind === 'image-dummy') {
            await byImageDummy(targetInfo.qrContent, options, mdqrOptions);
            addRemoveIdxs(removeIdxs, targetInfo.removeIdxs);
          } else if (targetInfo.kind === 'link-image-dummy') {
            await byLinkImageDummy(targetInfo.qrContent, options, mdqrOptions);
            addRemoveIdxs(removeIdxs, targetInfo.removeIdxs);
          }
        }
        if (removeIdxs.length > 0) {
          c.children = c.children.filter((t, i) => !removeIdxs.includes(i));
        }
      }
    }
  }
  return tree;
}
