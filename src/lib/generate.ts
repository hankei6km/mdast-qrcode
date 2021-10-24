import QRCode from 'qrcode';
import { MdqrOptions, mdqrOptionsDefaults } from '../qrcode.js';

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
  const mdqrOptions = Object.assign({ format: {} }, inMdqrOptions);
  const options = Object.assign({}, inOptions);

  return await QRCode.toDataURL(data, options);
}
