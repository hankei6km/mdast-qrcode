import * as path from 'path';
import { Root, Content, Image, Link } from 'mdast';
import QRCode from 'qrcode';
import { generateQRCode } from './lib/generate';
import { decodeQRCodeOptionsFromFileName } from './lib/options';
import { selectTarget } from './lib/select';

const qrcodeInAlt = /(^|(^.*):)qrcode:(.+)$/;
const QRCodeSourcKindValues = [
  '',
  'image-scheme',
  'image-dummy',
  'link-image-dummy'
] as const;
export type QRCodeSourcKind = typeof QRCodeSourcKindValues[number];
export type LogoOptions = {
  position?: 'center' | 'right-bottom';
  fillstyle?: string;
  fillshape?: 'rect' | 'circle';
  margin?: number;
  padding?: number;
  fit?: number;
};
export const logoOptionsDefaults: Required<LogoOptions> = {
  position: 'center',
  fillshape: 'circle',
  fillstyle: '#FFFFFFFF',
  margin: 72,
  padding: 4,
  fit: 35 // 面積で計算していないので注意
};

export async function byImageScheme(
  tree: Content[],
  options?: QRCode.QRCodeToDataURLOptions,
  logoOptions?: LogoOptions
) {
  const image = tree[0] as Image;
  const url: string = image.url || '';
  // as scheme
  const text = url.slice(7); // 'qrcode:'.length = 7
  const logo = tree.length > 1 ? (tree[1] as Image).url || '' : '';
  const d = await generateQRCode(text, logo, options);
  image.url = d;
}

export async function byImageDummy(
  tree: Content[],
  options?: QRCode.QRCodeToDataURLOptions,
  logoOptions?: LogoOptions
) {
  const image = tree[0] as Image;
  const alt: string = image.alt || '';
  // as alt
  const m = alt.match(qrcodeInAlt);
  if (m && m[3]) {
    //const d = await QRCode.toDataURL(m[3], options);
    const logo = tree.length > 1 ? (tree[1] as Image).url || '' : '';
    const logoAlt = tree.length > 1 ? (tree[1] as Image).alt || '' : '';
    const fileName = path.parse(image.url || '').name;
    const d = await generateQRCode(
      m[3],
      logo,
      ...decodeQRCodeOptionsFromFileName(options || {}, logoOptions || {}, [
        fileName,
        logoAlt
      ])
    );
    image.alt = m[2] || '';
    image.url = d;
  }
}

export async function byLinkImageDummy(
  tree: Content[],
  options?: QRCode.QRCodeToDataURLOptions,
  logoOptions?: LogoOptions
) {
  const link = tree[0] as Link;
  const cc = link.children[0];
  if (cc.type === 'image') {
    const image: Image = cc;
    //const d = await QRCode.toDataURL(tree.url, options);
    const logo = tree.length > 1 ? (tree[1] as Image).url || '' : '';
    const logoAlt = tree.length > 1 ? (tree[1] as Image).alt || '' : '';
    const fileName = path.parse(image.url || '').name;
    const d = await generateQRCode(
      link.url,
      logo,
      ...decodeQRCodeOptionsFromFileName(options || {}, logoOptions || {}, [
        fileName,
        logoAlt
      ])
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
  logoOptions: LogoOptions = { position: 'center' }
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
            await byImageScheme(targetInfo.qrContent, options, logoOptions);
            addRemoveIdxs(removeIdxs, targetInfo.removeIdxs);
          } else if (targetInfo.kind === 'image-dummy') {
            await byImageDummy(targetInfo.qrContent, options, logoOptions);
            addRemoveIdxs(removeIdxs, targetInfo.removeIdxs);
          } else if (targetInfo.kind === 'link-image-dummy') {
            await byLinkImageDummy(targetInfo.qrContent, options, logoOptions);
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
