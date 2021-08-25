import { createCanvas, loadImage } from 'canvas';
import QRCode from 'qrcode';
import { MdqrOptions, mdqrOptionsDefaults } from '../qrcode';

export async function generateQRCode(
  data: string,
  inOptions: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: 'M',
    margin: 4,
    scale: 4,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  },
  inMdqrOptions: MdqrOptions = {}
) {
  // https://stackoverflow.com/questions/64910446/how-to-add-logo-in-the-middle-of-the-qr-code-using-nodejs
  // const logoImg = await loadImage(
  //   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABxVBMVEX////+9Pb+9ff4rr7ycYzuQ2jsLFXrGUbqEkDqFkPsKFLuO2HxYoD2m6795uvzeJLrHUnqFEHwWXn6ytT//v72mKzqE0Hyaof+8vX+9vjxW3vsJU/xZILzfZb1kKb0hZ3ybortOV/tM1v83OPvS276w87//P384Obzd5LqGETsJlD71t7//f3rGkf4qrv83uTuP2T95er1j6T7ztfwWnrvTG782+LqF0TrHEj7z9j++PrvTW/2ma33obP96OzrI03+8PPvRmr3orT1k6jzfJX5v8vtMlntM1rtL1f709zzdI/71N33qbr4sL/xYH/0hJzxXHzyaIbqFULzdpHrH0rwWHj1iaDwUHLtNVzwUXPtNFz2nbD1jqTya4jsJ1H94+nyaIXvRWnzdY/84uj97fHtN17rIk3xXX396+/4ssH/+/zvSWz5t8XwVnf4tMLybYn70dr5u8jyaYb5vsvtMVntMFj6xND/+vvzepT0f5j6ydT3pbb6zNbyco30gJj/+fvvSm32lKn83uX0g5vrHkrwVXbwUnT4tsTrIEvuQGX4q7zsK1T+7vL84efxYYDsJE7xX371jKL6xdH6x9L2nK/xZoP3qLkktsJBAAACNklEQVRIx91UZ1sTQRBeE4gXIkHxQJSEIvFQjIi9BxErApEoUSOCClgQLBgUFUWs2Bvye513LwlxdxbJNx/nwz03b9k+I8T/G8uWLvV4i4p9yy1/SWBFafDv8mDZSmshVpWvXlxuV+TLEZVrqhbRr13nqqpD4Zrauno3Wd9g1kekIrLBcfPGjZuQN2026KPloLc050FbWwD5tvGG7XK4HX8e2U6AuxxOv3sPUXv3Kej+A3Ac5AxyrEMaHGsiuPWwrm+oJKLN1okjGKhdx48CP8bM7Bwn4oQG2ycBMxMIUYOhTmkrAtrBnt5pdk2dQLtYg11NVLeKxmGIsQZxhqiACvYQmIjyhrPEnVPBXrw5Xi+SmF297POEXTAYSmFQX/lFwlIGwyUY1JrFw2g1GPpQSOr+LqMgHd4QJq6f3dgAb7hC1FUV7IKhmTekiLqmgoMw1OUDub8hvONObZhh1OLCJgav37iZ+fUS4x/SDLWY4lY2G7lN+xx1/9EaxvSFDvgJrx/JZHdk/7iL27qHv/vM1sZBJLPZgzTSiYfiUTHOiCuUIJpeYjSbeiYTuJrwY3yfsKf3VLYlby6fCmT7ZZg/bvFMNtPnuVcznZSdz3oxbTA4Icn3zzS6+ctXryUQtw0GEZ3MrCH1pme8N51r4W9jJod451Pa/ex72c4/GB2emYk8+cf4JyeJC7LGPhst9lTfl8jw13TLt+8/ZBH8RMuy5sTSo+qXZYUK0FPMt3kKMwi7QP2/Hb8BC0lMdjCVM0EAAAAASUVORK5CYII='
  // );
  const mdqrOptions = Object.assign({ format: {} }, inMdqrOptions);
  const options = Object.assign({}, inOptions);
  const formatType =
    mdqrOptions.format.type !== undefined
      ? mdqrOptions.format.type
      : mdqrOptionsDefaults.format.type;
  const formatQuality =
    mdqrOptions.format.quality !== undefined
      ? mdqrOptions.format.quality
      : mdqrOptionsDefaults.format.quality;

  const qrImg = await loadImage(await QRCode.toDataURL(data, options));
  const canvas = createCanvas(qrImg.width, qrImg.height);

  const ctx = canvas.getContext('2d');
  // const center = (width - cwidth) / 2;
  ctx.drawImage(qrImg, 0, 0, qrImg.width, qrImg.height);
  const ret =
    formatType === 'png'
      ? canvas.toDataURL('image/png')
      : canvas.toDataURL('image/jpeg', formatQuality);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 環境が違うのでそんまま適用できないが、
  // できるだけメモリーが開放されるように.
  // https://tech.mobilefactory.jp/entry/2019/12/17/143000
  canvas.height = 0;
  canvas.width = 0;

  return ret;
}
