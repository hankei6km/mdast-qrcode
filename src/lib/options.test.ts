import { decodeQRCodeOptionsFromFileName } from './options';
describe('decodeQRCodeOptionsFromFileName()', () => {
  it('should decode from file name', () => {
    expect(
      decodeQRCodeOptionsFromFileName({}, {}, 'mdast-qrcode-margin-4')
    ).toEqual([
      {
        margin: 4,
        color: {}
      },
      {}
    ]);
    expect(
      decodeQRCodeOptionsFromFileName({}, {}, 'mdast-qrcode-scale-4')
    ).toEqual([
      {
        scale: 4,
        color: {}
      },
      {}
    ]);
    expect(
      decodeQRCodeOptionsFromFileName({}, {}, 'mdast-qrcode-width-200')
    ).toEqual([
      {
        width: 200,
        color: {}
      },
      {}
    ]);
    expect(
      decodeQRCodeOptionsFromFileName({}, {}, 'mdast-qrcode-scale-4-width-200')
    ).toEqual([
      {
        scale: 4,
        width: 200,
        color: {}
      },
      {}
    ]);
    expect(
      decodeQRCodeOptionsFromFileName(
        {},
        {},
        'mdast-qrcode-color-dark-111111FF'
      )
    ).toEqual([
      {
        color: { dark: '#111111FF' }
      },
      {}
    ]);
    expect(
      decodeQRCodeOptionsFromFileName(
        {},
        {},
        'mdast-qrcode-color-light-EEEEEEFF'
      )
    ).toEqual([
      {
        color: { light: '#EEEEEEFF' }
      },
      {}
    ]);
    expect(
      decodeQRCodeOptionsFromFileName(
        {},
        {},
        'mdast-qrcode-color-light-EEEEEEFF-logo-position-right-bottom'
      )
    ).toEqual([
      {
        color: { light: '#EEEEEEFF' }
      },
      { position: 'right-bottom' }
    ]);
    expect(
      decodeQRCodeOptionsFromFileName(
        {},
        {},
        'mdast-qrcode-logo-padding-10-color-light-EEEEEEFF'
      )
    ).toEqual([
      {
        color: { light: '#EEEEEEFF' }
      },
      { padding: 10 }
    ]);
  });
});
