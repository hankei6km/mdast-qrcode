import { QRCodeToDataURLOptions } from 'qrcode';
import { MdqrOptions } from '../qrcode';

// type OptionsInFileName = {
//   name: 'margin' | 'scale' | 'width';
//   decoder: RegExp;
// }[];
const optionsDecoderNum = [
  { name: 'margin', decoder: /(^|.+-)margin-(\d+)(-|$)/ },
  { name: 'scale', decoder: /(^|.+-)scale-(\d+)(-|$)/ },
  { name: 'width', decoder: /(^|.+-)width-(\d+)(-|$)/ }
];
const optionsDecoderColor = [
  // TODO: regexp の指定を RGBA の長さに合わせる
  { name: 'dark', decoder: /(^|.+-)color_dark-([0-9A-Fa-f]+)(-|$)/ },
  { name: 'light', decoder: /(^|.+-)color_light-([0-9A-Fa-f]+)(-|$)/ }
];
const optionsDecoderFormat = [
  {
    name: 'type',
    decoder: /(^|.+-)format_type-(png|jpeg)(-|$)/
  },
  { name: 'quality', decoder: /(^|.+-)format_quality-(\d+)(-|$)/ }
];

export function decodeOptions(
  options: QRCodeToDataURLOptions,
  mdqrOptions: MdqrOptions,
  sources: string[]
): [QRCodeToDataURLOptions, MdqrOptions] {
  const retOptions: any = JSON.parse(
    JSON.stringify(Object.assign({ color: {} }, options) || { color: {} })
  );
  const retMdqrOptions: any = JSON.parse(
    JSON.stringify(
      Object.assign({ format: {} }, mdqrOptions) || {
        format: {}
      }
    )
  );
  //  fileName と alt からでコードするので関数化してある.
  // TODO: ユーティリティ化などを検討.
  const decodeOptions = (out: any, src: string) => {
    optionsDecoderNum.forEach((o) => {
      const m = src.match(o.decoder);
      if (m) {
        out[o.name] = parseInt(m[2], 10);
      }
    });
    optionsDecoderColor.forEach((o) => {
      const m = src.match(o.decoder);
      if (m) {
        out.color[o.name] = `#${m[2]}`;
      }
    });
  };
  const decodeMdqrOptions = (out: any, src: string) => {
    optionsDecoderFormat.forEach((o) => {
      const m = src.match(o.decoder);
      if (m) {
        // TODO: decoder 側で代入用の関数を指定できるように.
        if (o.name === 'type') {
          out.format[o.name] = m[2];
        } else if (o.name === 'quality') {
          out.format[o.name] = parseInt(m[2], 10) / 100;
        }
      }
    });
  };
  sources.forEach((s) => decodeOptions(retOptions, s));
  sources.forEach((s) => decodeMdqrOptions(retMdqrOptions, s));

  return [retOptions, retMdqrOptions];
}
