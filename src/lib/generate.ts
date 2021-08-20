import { createCanvas, loadImage } from 'canvas';
import QRCode from 'qrcode';
import { LogoOptions, logoOptionsDefaults } from '../qrcode';

export async function generateQRCode(
  data: string,
  logo?: string,
  inOptions: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: 'M',
    margin: 4,
    scale: 4,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  },
  inLogoOptions: LogoOptions = {}
) {
  // https://stackoverflow.com/questions/64910446/how-to-add-logo-in-the-middle-of-the-qr-code-using-nodejs
  // const logoImg = await loadImage(
  //   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABxVBMVEX////+9Pb+9ff4rr7ycYzuQ2jsLFXrGUbqEkDqFkPsKFLuO2HxYoD2m6795uvzeJLrHUnqFEHwWXn6ytT//v72mKzqE0Hyaof+8vX+9vjxW3vsJU/xZILzfZb1kKb0hZ3ybortOV/tM1v83OPvS276w87//P384Obzd5LqGETsJlD71t7//f3rGkf4qrv83uTuP2T95er1j6T7ztfwWnrvTG782+LqF0TrHEj7z9j++PrvTW/2ma33obP96OzrI03+8PPvRmr3orT1k6jzfJX5v8vtMlntM1rtL1f709zzdI/71N33qbr4sL/xYH/0hJzxXHzyaIbqFULzdpHrH0rwWHj1iaDwUHLtNVzwUXPtNFz2nbD1jqTya4jsJ1H94+nyaIXvRWnzdY/84uj97fHtN17rIk3xXX396+/4ssH/+/zvSWz5t8XwVnf4tMLybYn70dr5u8jyaYb5vsvtMVntMFj6xND/+vvzepT0f5j6ydT3pbb6zNbyco30gJj/+fvvSm32lKn83uX0g5vrHkrwVXbwUnT4tsTrIEvuQGX4q7zsK1T+7vL84efxYYDsJE7xX371jKL6xdH6x9L2nK/xZoP3qLkktsJBAAACNklEQVRIx91UZ1sTQRBeE4gXIkHxQJSEIvFQjIi9BxErApEoUSOCClgQLBgUFUWs2Bvye513LwlxdxbJNx/nwz03b9k+I8T/G8uWLvV4i4p9yy1/SWBFafDv8mDZSmshVpWvXlxuV+TLEZVrqhbRr13nqqpD4Zrauno3Wd9g1kekIrLBcfPGjZuQN2026KPloLc050FbWwD5tvGG7XK4HX8e2U6AuxxOv3sPUXv3Kej+A3Ac5AxyrEMaHGsiuPWwrm+oJKLN1okjGKhdx48CP8bM7Bwn4oQG2ycBMxMIUYOhTmkrAtrBnt5pdk2dQLtYg11NVLeKxmGIsQZxhqiACvYQmIjyhrPEnVPBXrw5Xi+SmF297POEXTAYSmFQX/lFwlIGwyUY1JrFw2g1GPpQSOr+LqMgHd4QJq6f3dgAb7hC1FUV7IKhmTekiLqmgoMw1OUDub8hvONObZhh1OLCJgav37iZ+fUS4x/SDLWY4lY2G7lN+xx1/9EaxvSFDvgJrx/JZHdk/7iL27qHv/vM1sZBJLPZgzTSiYfiUTHOiCuUIJpeYjSbeiYTuJrwY3yfsKf3VLYlby6fCmT7ZZg/bvFMNtPnuVcznZSdz3oxbTA4Icn3zzS6+ctXryUQtw0GEZ3MrCH1pme8N51r4W9jJod451Pa/ex72c4/GB2emYk8+cf4JyeJC7LGPhst9lTfl8jw13TLt+8/ZBH8RMuy5sTSo+qXZYUK0FPMt3kKMwi7QP2/Hb8BC0lMdjCVM0EAAAAASUVORK5CYII='
  // );
  let logoImg = logo
    ? await loadImage(logo).catch((err) => {
        // TODO: error 画像を表示させる.
        console.error(`logo loadImage: ${err}`);
      })
    : null;
  const options = Object.assign({}, inOptions);
  if (logoImg) {
    options.errorCorrectionLevel = 'H';
  }
  const logoOptions = Object.assign({}, inLogoOptions);
  const logoPosition =
    logoOptions.position !== undefined
      ? logoOptions.position
      : logoOptionsDefaults.position;
  const logoFillstyle =
    logoOptions.fillstyle !== undefined
      ? logoOptions.fillstyle
      : logoOptionsDefaults.fillstyle;
  const logoFillshape =
    logoOptions.fillshape !== undefined
      ? logoOptions.fillshape
      : logoOptionsDefaults.fillshape;
  const logoPadding =
    logoOptions.padding !== undefined
      ? logoOptions.padding
      : logoOptionsDefaults.padding;
  const logoMargin =
    logoOptions.margin !== undefined
      ? logoOptions.margin
      : logoOptionsDefaults.margin;
  const logoFit =
    logoOptions.fit !== undefined ? logoOptions.fit : logoOptionsDefaults.fit;

  const qrImg = await loadImage(await QRCode.toDataURL(data, options));
  const canvas = createCanvas(qrImg.width, qrImg.height);

  const ctx = canvas.getContext('2d');
  // const center = (width - cwidth) / 2;
  ctx.drawImage(qrImg, 0, 0, qrImg.width, qrImg.height);
  if (logoImg) {
    let w = logoImg.width;
    let h = logoImg.height;
    if (logoFit > 0) {
      const fitSize = (qrImg.width * logoFit) / 100;
      w = fitSize;
      h = fitSize;
      if (logoImg.width > logoImg.height) {
        w = fitSize;
        h = (logoImg.height * fitSize) / logoImg.width;
      } else if (logoImg.width < logoImg.height) {
        w = (logoImg.width * fitSize) / logoImg.height;
        h = fitSize;
      }
    }
    const x =
      logoPosition === 'center'
        ? (qrImg.width - w) / 2
        : qrImg.width - (w + logoMargin);
    const y =
      logoPosition === 'center'
        ? (qrImg.height - h) / 2
        : qrImg.height - (h + logoMargin);
    ctx.fillStyle = logoFillstyle;
    if (logoFillshape === 'rect') {
      ctx.fillRect(x, y, w, h);
    } else {
      ctx.beginPath();
      ctx.arc(
        x + w / 2,
        y + h / 2,
        // 楕円には対応していない.
        w / 2,
        0,
        2 * Math.PI,
        false
      );
      ctx.fill();
    }
    ctx.drawImage(
      logoImg,
      x + logoPadding,
      y + logoPadding,
      w - logoPadding * 2,
      h - logoPadding * 2
    );
  }
  return canvas.toDataURL('image/png');
}
