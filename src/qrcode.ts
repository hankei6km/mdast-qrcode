import * as path from 'path';
import { Root, Content, Image, Link } from 'mdast';
import { createCanvas, loadImage } from 'canvas';
import QRCode from 'qrcode';

const dummyQrcodeFile = 'mdast-qrcode';
const qrcodeInAlt = /(^|(^.*):)qrcode:(.+)$/;
const QRCodeSourcKindeValues = [
  '',
  'image-scheme',
  'image-dummy',
  'link-image-dummy'
] as const;
export type QRCodeSourcKinde = typeof QRCodeSourcKindeValues[number];

export async function qrcodeToDataURL(
  data: string,
  inOptions: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: 'H',
    margin: 4,
    scale: 4,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  }
) {
  // https://stackoverflow.com/questions/64910446/how-to-add-logo-in-the-middle-of-the-qr-code-using-nodejs
  const options = Object.assign({}, inOptions);
  options.errorCorrectionLevel = 'H';

  const qrImg = await loadImage(await QRCode.toDataURL(data, options));
  const canvas = createCanvas(qrImg.width, qrImg.height);

  const ctx = canvas.getContext('2d');
  // const center = (width - cwidth) / 2;
  ctx.drawImage(qrImg, 0, 0, qrImg.width, qrImg.height);
  return canvas.toDataURL('image/png');
}

export async function byImageScheme(
  image: Image,
  options?: QRCode.QRCodeToDataURLOptions
) {
  const url: string = image.url || '';
  // as scheme
  const text = url.slice(7); // 'qrcode:'.length = 7
  //const d = await QRCode.toDataURL(text, options);
  const d = await qrcodeToDataURL(text);
  image.url = d;
}

export async function byImageDummy(
  image: Image,
  options?: QRCode.QRCodeToDataURLOptions
) {
  const alt: string = image.alt || '';
  // as alt
  const m = alt.match(qrcodeInAlt);
  if (m && m[3]) {
    //const d = await QRCode.toDataURL(m[3], options);
    const d = await qrcodeToDataURL(m[3]);
    image.alt = m[2] || '';
    image.url = d;
  }
}

export async function byLinkImageDummy(
  tree: Link,
  options?: QRCode.QRCodeToDataURLOptions
) {
  const cc = tree.children[0];
  if (cc.type === 'image') {
    const image: Image = cc;
    const url: string = image.url || '';
    if (path.parse(url).name === dummyQrcodeFile) {
      //const d = await QRCode.toDataURL(tree.url, options);
      const d = await qrcodeToDataURL(tree.url);
      image.url = d;
    }
  }
}

export function stackTarget(
  c: Content[],
  idx: number
): [QRCodeSourcKinde, Content[]] {
  const ret: [QRCodeSourcKinde, Content[]] = ['', []];
  const top = c[idx];
  ret[1].push(top);
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
  return ret;
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
        let step = 1;
        for (let ii = 0; ii < ll; ii = ii + step) {
          //const cc: Content[] = [c.children[ii]];
          const [kind, cc] = stackTarget(c.children, ii);
          step = cc.length;

          if (kind === 'image-scheme') {
            await byImageScheme(cc[0] as Image, options);
          } else if (kind === 'image-dummy') {
            await byImageDummy(cc[0] as Image, options);
          } else if (kind === 'link-image-dummy') {
            await byLinkImageDummy(cc[0] as Link, options);
          }
        }
      }
    }
  }
  return tree;
}
