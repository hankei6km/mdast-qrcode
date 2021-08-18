import { QRCodeToDataURLOptions } from 'qrcode';

// type OptionsInFileName = {
//   name: 'margin' | 'scale' | 'width';
//   decoder: RegExp;
// }[];
const optionsDecoderNum = [
  { name: 'margin', decoder: /.+-margin-(\d+)(-|$)/ },
  { name: 'scale', decoder: /.+-scale-(\d+)(-|$)/ },
  { name: 'width', decoder: /.+-width-(\d+)(-|$)/ }
];
const optionsDecoderColor = [
  // TODO: regexp の指定を RGBA の長さに合わせる
  { name: 'dark', decoder: /.+-color-dark-(#[0-9A-Fa-f]+)(-|$)/ },
  { name: 'light', decoder: /.+-color-light-(#[0-9A-Fa-f]+)(-|$)/ }
];
export function decodeQRCodeOptionsFromFileName(
  options: QRCodeToDataURLOptions,
  fileName: string
): QRCodeToDataURLOptions {
  const ret: any = Object.assign(
    {
      color: {}
    },
    options || {}
  );
  optionsDecoderNum.forEach((o) => {
    const m = fileName.match(o.decoder);
    if (m) {
      ret[o.name] = parseInt(m[1], 10);
    }
  });
  optionsDecoderColor.forEach((o) => {
    const m = fileName.match(o.decoder);
    if (m) {
      ret.color[o.name] = m[1];
    }
  });
  return ret;
}
