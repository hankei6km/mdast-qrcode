import { decodeOptions } from './options';
describe('decodeOptions()', () => {
  it('should decode from file names / log alt', () => {
    expect(decodeOptions({}, {}, ['mdast-qrcode-margin-4', '', ''])).toEqual([
      {
        margin: 4,
        color: {}
      },
      { logo: {}, format: {} }
    ]);
    expect(decodeOptions({}, {}, ['mdast-qrcode-scale-4', '', ''])).toEqual([
      {
        scale: 4,
        color: {}
      },
      { logo: {}, format: {} }
    ]);
    expect(decodeOptions({}, {}, ['mdast-qrcode-width-200', '', ''])).toEqual([
      {
        width: 200,
        color: {}
      },
      { logo: {}, format: {} }
    ]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-scale-4-width-200', '', ''])
    ).toEqual([
      {
        scale: 4,
        width: 200,
        color: {}
      },
      { logo: {}, format: {} }
    ]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-color_dark-111111FF', '', ''])
    ).toEqual([
      {
        color: { dark: '#111111FF' }
      },
      { logo: {}, format: {} }
    ]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-color_light-EEEEEEFF', '', ''])
    ).toEqual([
      {
        color: { light: '#EEEEEEFF' }
      },
      { logo: {}, format: {} }
    ]);
    expect(
      decodeOptions({}, {}, [
        'mdast-qrcode-color_light-EEEEEEFF-logo_position-right-bottom',
        '',
        ''
      ])
    ).toEqual([
      {
        color: { light: '#EEEEEEFF' }
      },
      { logo: { position: 'right-bottom' }, format: {} }
    ]);
    expect(
      decodeOptions({}, {}, [
        'mdast-qrcode-logo_margin-10-color_light-EEEEEEFF',
        '',
        ''
      ])
    ).toEqual([
      {
        color: { light: '#EEEEEEFF' }
      },
      { logo: { margin: 10 }, format: {} }
    ]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-logo_fillstyle-FF0000FF', '', ''])
    ).toEqual([
      { color: {} },
      { logo: { fillstyle: '#FF0000FF' }, format: {} }
    ]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-logo_fillshape-circle', '', ''])
    ).toEqual([{ color: {} }, { logo: { fillshape: 'circle' }, format: {} }]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-logo_padding-20', '', ''])
    ).toEqual([{ color: {} }, { logo: { padding: 20 }, format: {} }]);
    expect(
      decodeOptions({}, {}, [
        'mdast-qrcode-logo_query-w=100&text=abc-123',
        '',
        ''
      ])
    ).toEqual([
      { color: {} },
      { logo: { query: 'w=100&text=abc-123' }, format: {} }
    ]);
    expect(
      decodeOptions({}, {}, [
        'mdast-qrcode-logo_query-w%3D100%26text%3Dabc-123',
        '',
        ''
      ])
    ).toEqual([
      { color: {} },
      { logo: { query: 'w=100&text=abc-123' }, format: {} }
    ]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-format_type-jpeg', '', ''])
    ).toEqual([{ color: {} }, { logo: {}, format: { type: 'jpeg' } }]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-format_quality-50', '', ''])
    ).toEqual([{ color: {} }, { logo: {}, format: { quality: 0.5 } }]);
  });
  it('should decode from multiple sources', () => {
    expect(
      decodeOptions({}, {}, [
        'mdast-qrcode-width-400-color_dark-00FF00FF-logo_padding-20-logo_fit-10',
        'logo-width-401-color_dark-00FFFFFF-logo_padding-21-logo_fit-11',
        ''
      ])
    ).toEqual([
      { width: 401, color: { dark: '#00FFFFFF' } },
      { logo: { padding: 21, fit: 11 }, format: {} }
    ]);
    expect(
      decodeOptions({}, {}, [
        'mdast-qrcode-width-400-color_dark-00FF00FF-logo_padding-20-logo_fit-10',
        'logo-width-401-color_dark-00FFFFFF-logo_padding-21-logo_fit-11',
        'logo_fit-12'
      ])
    ).toEqual([
      { width: 401, color: { dark: '#00FFFFFF' } },
      { logo: { padding: 21, fit: 12 }, format: {} }
    ]);
  });
});
