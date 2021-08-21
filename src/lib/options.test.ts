import { decodeOptions } from './options';
describe('decodeOptions()', () => {
  it('should decode from file name', () => {
    expect(decodeOptions({}, {}, ['mdast-qrcode-margin-4', ''])).toEqual([
      {
        margin: 4,
        color: {}
      },
      {}
    ]);
    expect(decodeOptions({}, {}, ['mdast-qrcode-scale-4', ''])).toEqual([
      {
        scale: 4,
        color: {}
      },
      {}
    ]);
    expect(decodeOptions({}, {}, ['mdast-qrcode-width-200', ''])).toEqual([
      {
        width: 200,
        color: {}
      },
      {}
    ]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-scale-4-width-200', ''])
    ).toEqual([
      {
        scale: 4,
        width: 200,
        color: {}
      },
      {}
    ]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-color_dark-111111FF', ''])
    ).toEqual([
      {
        color: { dark: '#111111FF' }
      },
      {}
    ]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-color_light-EEEEEEFF', ''])
    ).toEqual([
      {
        color: { light: '#EEEEEEFF' }
      },
      {}
    ]);
    expect(
      decodeOptions({}, {}, [
        'mdast-qrcode-color_light-EEEEEEFF-logo_position-right-bottom',
        ''
      ])
    ).toEqual([
      {
        color: { light: '#EEEEEEFF' }
      },
      { position: 'right-bottom' }
    ]);
    expect(
      decodeOptions({}, {}, [
        'mdast-qrcode-logo_margin-10-color_light-EEEEEEFF',
        ''
      ])
    ).toEqual([
      {
        color: { light: '#EEEEEEFF' }
      },
      { margin: 10 }
    ]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-logo_fillstyle-FF0000FF', ''])
    ).toEqual([{ color: {} }, { fillstyle: '#FF0000FF' }]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-logo_fillshape-circle', ''])
    ).toEqual([{ color: {} }, { fillshape: 'circle' }]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-logo_padding-20', ''])
    ).toEqual([{ color: {} }, { padding: 20 }]);
  });
  it('should decode from multiple sources', () => {
    expect(
      decodeOptions({}, {}, [
        'mdast-qrcode-width-400-color_dark-00FF00FF-logo_padding-20-logo_fit-10',
        'width-401-color_dark-00FFFFFF-logo_padding-21-logo_fit-11'
      ])
    ).toEqual([
      { width: 401, color: { dark: '#00FFFFFF' } },
      { padding: 21, fit: 11 }
    ]);
  });
});
