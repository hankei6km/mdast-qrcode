import { decodeQRCodeOptionsFromFileName } from './options';
describe('decodeQRCodeOptionsFromFileName()', () => {
  it('should decode from file name', () => {
    expect(
      decodeQRCodeOptionsFromFileName({}, {}, 'mdast-qrcode-margin-4', '')
    ).toEqual([
      {
        margin: 4,
        color: {}
      },
      {}
    ]);
    expect(
      decodeQRCodeOptionsFromFileName({}, {}, 'mdast-qrcode-scale-4', '')
    ).toEqual([
      {
        scale: 4,
        color: {}
      },
      {}
    ]);
    expect(
      decodeQRCodeOptionsFromFileName({}, {}, 'mdast-qrcode-width-200', '')
    ).toEqual([
      {
        width: 200,
        color: {}
      },
      {}
    ]);
    expect(
      decodeQRCodeOptionsFromFileName(
        {},
        {},
        'mdast-qrcode-scale-4-width-200',
        ''
      )
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
        'mdast-qrcode-color_dark-111111FF',
        ''
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
        'mdast-qrcode-color_light-EEEEEEFF',
        ''
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
        'mdast-qrcode-color_light-EEEEEEFF-logo_position-right-bottom',
        ''
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
        'mdast-qrcode-logo_margin-10-color_light-EEEEEEFF',
        ''
      )
    ).toEqual([
      {
        color: { light: '#EEEEEEFF' }
      },
      { margin: 10 }
    ]);
    expect(
      decodeQRCodeOptionsFromFileName(
        {},
        {},
        'mdast-qrcode-logo_fillstyle-FF0000FF',
        ''
      )
    ).toEqual([{ color: {} }, { fillstyle: '#FF0000FF' }]);
    expect(
      decodeQRCodeOptionsFromFileName(
        {},
        {},
        'mdast-qrcode-logo_fillshape-circle',
        ''
      )
    ).toEqual([{ color: {} }, { fillshape: 'circle' }]);
    expect(
      decodeQRCodeOptionsFromFileName(
        {},
        {},
        'mdast-qrcode-logo_padding-20',
        ''
      )
    ).toEqual([{ color: {} }, { padding: 20 }]);
    expect(
      decodeQRCodeOptionsFromFileName(
        {},
        {},
        'mdast-qrcode',
        'logo_padding-21-logo_fit-10'
      )
    ).toEqual([{ color: {} }, { padding: 21, fit: 10 }]);
    expect(
      decodeQRCodeOptionsFromFileName(
        {},
        {},
        'mdast-qrcode-logo_padding-20',
        'logo_padding-22'
      )
    ).toEqual([{ color: {} }, { padding: 22 }]);
  });
});
