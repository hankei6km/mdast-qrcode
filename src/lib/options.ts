import { QRCodeToDataURLOptions } from 'qrcode';
import { LogoOptions } from '../qrcode';

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
  { name: 'dark', decoder: /.+-color-dark-([0-9A-Fa-f]+)(-|$)/ },
  { name: 'light', decoder: /.+-color-light-([0-9A-Fa-f]+)(-|$)/ }
];
const optionsDecoderLogo = [
  {
    name: 'logo-position',
    decoder: /.+-logo-position-(center|right-bottom)(-|$)/
  },
  {
    name: 'logo-padding',
    decoder: /.+-logo-padding-(\d+)(-|$)/
  },
  {
    name: 'logo-fit',
    decoder: /.+-logo-fit-(\d+)(-|$)/
  }
];
export function decodeQRCodeOptionsFromFileName(
  options: QRCodeToDataURLOptions,
  logoOptions: LogoOptions,
  fileName: string
): [QRCodeToDataURLOptions, LogoOptions] {
  const retOptions: any = Object.assign(
    {
      color: {}
    },
    options || {}
  );
  const retLogoOptions: any = Object.assign({}, logoOptions || {});
  optionsDecoderNum.forEach((o) => {
    const m = fileName.match(o.decoder);
    if (m) {
      retOptions[o.name] = parseInt(m[1], 10);
    }
  });
  optionsDecoderColor.forEach((o) => {
    const m = fileName.match(o.decoder);
    if (m) {
      retOptions.color[o.name] = `#${m[1]}`;
    }
  });
  optionsDecoderLogo.forEach((o) => {
    const m = fileName.match(o.decoder);
    if (m) {
      // TODO: decoder 側で型を指定できるように.
      if (o.name === 'logo-position') {
        retLogoOptions[o.name.replace(/^logo-/, '')] = m[1];
      } else {
        retLogoOptions[o.name.replace(/^logo-/, '')] = parseInt(m[1], 10);
      }
    }
  });
  return [retOptions, retLogoOptions];
}
