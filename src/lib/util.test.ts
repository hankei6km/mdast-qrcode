import { getFileNameFromURL, validLogoImageURL } from './util';

describe('getFileNameFromURL()', () => {
  it('should retun filename from path', () => {
    expect(getFileNameFromURL('test.png')).toEqual('test');
    expect(getFileNameFromURL('/path/to/test.png')).toEqual('test');
  });
  it('should retun filename from url', () => {
    expect(getFileNameFromURL('https://hankei6km.github.io/logo.png')).toEqual(
      'logo'
    );
    expect(
      getFileNameFromURL('https://hankei6km.github.io/logo.png#hash')
    ).toEqual('logo');
    expect(
      getFileNameFromURL('https://hankei6km.github.io/logo.png&w=100')
    ).toEqual('logo');
  });
  it('should retun blank from data', () => {
    expect(
      getFileNameFromURL('data:image/png;base64,iVBORw0KGgoAAAANS')
    ).toEqual('');
  });
});

describe('validLogoImageURL()', () => {
  it('should return true', async () => {
    expect(
      validLogoImageURL('http://hankei6km.github.io/logo.png')
    ).toBeTruthy();
    expect(
      validLogoImageURL('https://hankei6km.github.io/logo.png')
    ).toBeTruthy();
    expect(
      validLogoImageURL('data:image/png;base64,iVBORw0KGgoAAAANSU')
    ).toBeTruthy();
  });
  it('should return false', async () => {
    expect(validLogoImageURL('/path/to/logo.png')).toBeFalsy();
    expect(validLogoImageURL('logo.png')).toBeFalsy();
    expect(validLogoImageURL('')).toBeFalsy();
  });
});
