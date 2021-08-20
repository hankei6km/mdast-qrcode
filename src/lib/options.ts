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
    decoder: /(^|.+-)logo_position-(center|right-bottom)(-|$)/
  },
  { name: 'fillstyle', decoder: /(^|.+-)logo_fillstyle-([0-9A-Fa-f]+)(-|$)/ },
  {
    name: 'fillshape',
    decoder: /(^|.+-)logo_fillshape-(rect|circle)(-|$)/
  },
  {
    name: 'margin',
    decoder: /(^|.+-)logo_margin-(\d+)(-|$)/
  },
  {
    name: 'padding',
    decoder: /(^|.+-)logo_padding-(\d+)(-|$)/
  },
  {
    name: 'fit',
    decoder: /(^|.+-)logo_fit-(\d+)(-|$)/
  }
];
export function decodeQRCodeOptionsFromFileName(
  options: QRCodeToDataURLOptions,
  logoOptions: LogoOptions,
  fileName: string,
  alt: string
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
  // logo options は fileName と alt からでコードするので関数化してある.
  // TODO: ユーティリティ化などを検討.
  const decodeLogoOptions = (out: any, src: string) => {
    optionsDecoderLogo.forEach((o) => {
      const m = src.match(o.decoder);
      if (m) {
        // TODO: decoder 側で代入用の関数を指定できるように.
        if (o.name === 'position' || o.name === 'fillshape') {
          out[o.name] = m[2];
        } else if (o.name === 'fillstyle') {
          out[o.name] = `#${m[2]}`;
        } else {
          out[o.name] = parseInt(m[2], 10);
        }
      }
    });
  };
  decodeLogoOptions(retLogoOptions, fileName);
  decodeLogoOptions(retLogoOptions, alt);
  return [retOptions, retLogoOptions];
}
