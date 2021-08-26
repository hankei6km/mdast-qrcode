import { decodeOptions } from './options';
describe('decodeOptions()', () => {
  it('should decode from file names / log alt', () => {
    expect(decodeOptions({}, {}, ['mdast-qrcode-eclevel-L', '', ''])).toEqual([
      {
        errorCorrectionLevel: 'L',
        color: {}
      },
      { format: {} }
    ]);
    expect(decodeOptions({}, {}, ['mdast-qrcode-margin-4', '', ''])).toEqual([
      {
        margin: 4,
        color: {}
      },
      { format: {} }
    ]);
    expect(decodeOptions({}, {}, ['mdast-qrcode-scale-4', '', ''])).toEqual([
      {
        scale: 4,
        color: {}
      },
      { format: {} }
    ]);
    expect(decodeOptions({}, {}, ['mdast-qrcode-width-200', '', ''])).toEqual([
      {
        width: 200,
        color: {}
      },
      { format: {} }
    ]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-scale-4-width-200', '', ''])
    ).toEqual([
      {
        scale: 4,
        width: 200,
        color: {}
      },
      { format: {} }
    ]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-color_dark-111111FF', '', ''])
    ).toEqual([
      {
        color: { dark: '#111111FF' }
      },
      { format: {} }
    ]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-color_light-EEEEEEFF', '', ''])
    ).toEqual([
      {
        color: { light: '#EEEEEEFF' }
      },
      { format: {} }
    ]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-format_type-jpeg', '', ''])
    ).toEqual([{ color: {} }, { format: { type: 'jpeg' } }]);
    expect(
      decodeOptions({}, {}, ['mdast-qrcode-format_quality-50', '', ''])
    ).toEqual([{ color: {} }, { format: { quality: 0.5 } }]);
  });
  it('should decode from multiple sources', () => {
    expect(
      decodeOptions({}, {}, [
        'mdast-qrcode-width-400-color_dark-00FF00FF',
        'width-401-color_dark-00FFFFFF',
        ''
      ])
    ).toEqual([{ width: 401, color: { dark: '#00FFFFFF' } }, { format: {} }]);
    expect(
      decodeOptions({}, {}, [
        'mdast-qrcode-width-400-color_dark-00FF00FF',
        'width-401-color_dark-00FFFFFF',
        'width-402'
      ])
    ).toEqual([{ width: 402, color: { dark: '#00FFFFFF' } }, { format: {} }]);
  });
});
