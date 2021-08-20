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
  { name: 'dark', decoder: /.+-color_dark-([0-9A-Fa-f]+)(-|$)/ },
  { name: 'light', decoder: /.+-color_light-([0-9A-Fa-f]+)(-|$)/ }
];
const optionsDecoderLogo = [
  {
    name: 'position',
    decoder: /.+-logo_position-(center|right-bottom)(-|$)/
  },
  { name: 'fillstyle', decoder: /.+-logo_fillstyle-([0-9A-Fa-f]+)(-|$)/ },
  {
    name: 'margin',
    decoder: /.+-logo_margin-(\d+)(-|$)/
  },
  {
    name: 'padding',
    decoder: /.+-logo_padding-(\d+)(-|$)/
  },
  {
    name: 'fit',
    decoder: /.+-logo_fit-(\d+)(-|$)/
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
      if (o.name === 'position') {
        retLogoOptions[o.name] = m[1];
      } else if (o.name === 'fillstyle') {
        retLogoOptions[o.name] = `#${m[1]}`;
      } else {
        retLogoOptions[o.name] = parseInt(m[1], 10);
      }
    }
  });
  return [retOptions, retLogoOptions];
}
