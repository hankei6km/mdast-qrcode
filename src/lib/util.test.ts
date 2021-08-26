import { getFileNameFromURL, replaceQuery, validLogoImageURL } from './util';

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

describe('replaceQuery()', () => {
  const toMap = (url: string) => {
    const query: { [key: string]: any } = {};
    const u = url.split('?', 2);
    if (u.length > 1) {
      const p = new URLSearchParams(u[1]);
      p.forEach((v, k) => {
        query[k] = v;
      });
    }
    return [u[0], query];
  };
  it('should add query to url', async () => {
    expect(
      toMap(replaceQuery('http://hankei6km.github.io/logo.png', 'w=100&h=100'))
    ).toEqual(toMap('http://hankei6km.github.io/logo.png?w=100&h=100'));
    expect(
      toMap(replaceQuery('http://hankei6km.github.io/logo.png', '?w=100&h=100'))
    ).toEqual(toMap('http://hankei6km.github.io/logo.png?w=100&h=100'));
    expect(
      toMap(replaceQuery('http://hankei6km.github.io/logo.png', 'abc'))
    ).toEqual(toMap('http://hankei6km.github.io/logo.png?abc'));
  });
  it('should replace query to url', async () => {
    expect(
      toMap(replaceQuery('http://hankei6km.github.io/logo.png?h=100', 'w=100'))
    ).toEqual(toMap('http://hankei6km.github.io/logo.png?w=100'));
    expect(
      toMap(replaceQuery('http://hankei6km.github.io/logo.png?h=100', 'abc'))
    ).toEqual(toMap('http://hankei6km.github.io/logo.png?abc'));
  });
  it('should add blank', async () => {
    expect(
      toMap(replaceQuery('http://hankei6km.github.io/logo.png?h=100', ''))
    ).toEqual(toMap('http://hankei6km.github.io/logo.png?h=100'));
    expect(
      toMap(replaceQuery('data:image/png;base64,iVBORw0KGgoAAAANS', 'w=100'))
    ).toEqual(toMap('data:image/png;base64,iVBORw0KGgoAAAANS'));
  });
});
