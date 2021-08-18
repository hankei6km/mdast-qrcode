import { Root, Content, Image, Link } from 'mdast';
import { createCanvas, loadImage } from 'canvas';
import QRCode from 'qrcode';
import { selectTarget } from './lib/select';

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
  logo?: string,
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

  // const logoImg = await loadImage(
  //   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABxVBMVEX////+9Pb+9ff4rr7ycYzuQ2jsLFXrGUbqEkDqFkPsKFLuO2HxYoD2m6795uvzeJLrHUnqFEHwWXn6ytT//v72mKzqE0Hyaof+8vX+9vjxW3vsJU/xZILzfZb1kKb0hZ3ybortOV/tM1v83OPvS276w87//P384Obzd5LqGETsJlD71t7//f3rGkf4qrv83uTuP2T95er1j6T7ztfwWnrvTG782+LqF0TrHEj7z9j++PrvTW/2ma33obP96OzrI03+8PPvRmr3orT1k6jzfJX5v8vtMlntM1rtL1f709zzdI/71N33qbr4sL/xYH/0hJzxXHzyaIbqFULzdpHrH0rwWHj1iaDwUHLtNVzwUXPtNFz2nbD1jqTya4jsJ1H94+nyaIXvRWnzdY/84uj97fHtN17rIk3xXX396+/4ssH/+/zvSWz5t8XwVnf4tMLybYn70dr5u8jyaYb5vsvtMVntMFj6xND/+vvzepT0f5j6ydT3pbb6zNbyco30gJj/+fvvSm32lKn83uX0g5vrHkrwVXbwUnT4tsTrIEvuQGX4q7zsK1T+7vL84efxYYDsJE7xX371jKL6xdH6x9L2nK/xZoP3qLkktsJBAAACNklEQVRIx91UZ1sTQRBeE4gXIkHxQJSEIvFQjIi9BxErApEoUSOCClgQLBgUFUWs2Bvye513LwlxdxbJNx/nwz03b9k+I8T/G8uWLvV4i4p9yy1/SWBFafDv8mDZSmshVpWvXlxuV+TLEZVrqhbRr13nqqpD4Zrauno3Wd9g1kekIrLBcfPGjZuQN2026KPloLc050FbWwD5tvGG7XK4HX8e2U6AuxxOv3sPUXv3Kej+A3Ac5AxyrEMaHGsiuPWwrm+oJKLN1okjGKhdx48CP8bM7Bwn4oQG2ycBMxMIUYOhTmkrAtrBnt5pdk2dQLtYg11NVLeKxmGIsQZxhqiACvYQmIjyhrPEnVPBXrw5Xi+SmF297POEXTAYSmFQX/lFwlIGwyUY1JrFw2g1GPpQSOr+LqMgHd4QJq6f3dgAb7hC1FUV7IKhmTekiLqmgoMw1OUDub8hvONObZhh1OLCJgav37iZ+fUS4x/SDLWY4lY2G7lN+xx1/9EaxvSFDvgJrx/JZHdk/7iL27qHv/vM1sZBJLPZgzTSiYfiUTHOiCuUIJpeYjSbeiYTuJrwY3yfsKf3VLYlby6fCmT7ZZg/bvFMNtPnuVcznZSdz3oxbTA4Icn3zzS6+ctXryUQtw0GEZ3MrCH1pme8N51r4W9jJod451Pa/ex72c4/GB2emYk8+cf4JyeJC7LGPhst9lTfl8jw13TLt+8/ZBH8RMuy5sTSo+qXZYUK0FPMt3kKMwi7QP2/Hb8BC0lMdjCVM0EAAAAASUVORK5CYII='
  // );
  let logoImg = logo ? await loadImage(logo) : null;
  const qrImg = await loadImage(await QRCode.toDataURL(data, options));
  const canvas = createCanvas(qrImg.width, qrImg.height);

  const ctx = canvas.getContext('2d');
  // const center = (width - cwidth) / 2;
  ctx.drawImage(qrImg, 0, 0, qrImg.width, qrImg.height);
  if (logoImg) {
    ctx.drawImage(
      logoImg,
      (qrImg.width - logoImg.width) / 2,
      (qrImg.height - logoImg.height) / 2,
      logoImg.width,
      logoImg.height
    );
  }
  return canvas.toDataURL('image/png');
}

export async function byImageScheme(
  tree: Content[],
  options?: QRCode.QRCodeToDataURLOptions
) {
  const image = tree[0] as Image;
  const url: string = image.url || '';
  // as scheme
  const text = url.slice(7); // 'qrcode:'.length = 7
  //const d = await QRCode.toDataURL(text, options);
  const d = await qrcodeToDataURL(text);
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
    const d = await qrcodeToDataURL(m[3]);
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
    const d = await qrcodeToDataURL(link.url);
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
