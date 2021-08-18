import { Content } from 'mdast';
import fromMarkdown from 'mdast-util-from-markdown';
import { validLogoImageURL, pickLogo, selectTarget } from './select';

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

describe('pickLogo()', () => {
  it('should pick "line break + image"', async () => {
    const tree = fromMarkdown(
      '![alt1](qrcode:test1)\n![](https://hankei6km.github.io/logo.png)'
    );
    const c: Content[] = tree.children[0].children as Content[];
    const sel = pickLogo(c, 0);
    expect(sel).toEqual([1, 2]);
  });
  it('should pick "image"', async () => {
    const tree = fromMarkdown(
      '![alt1](qrcode:test1)![](https://hankei6km.github.io/logo.png)'
    );
    const c: Content[] = tree.children[0].children as Content[];
    const sel = pickLogo(c, 0);
    expect(sel).toEqual([1]);
  });
  it('should skip "image" that have invalid url ', async () => {
    const tree = fromMarkdown('![alt1](qrcode:test1)![](/path/to/logo.png)');
    const c: Content[] = tree.children[0].children as Content[];
    const sel = pickLogo(c, 0);
    expect(sel).toEqual([]);
  });
});

describe('selectTarget()', () => {
  it('should return "image-scheme" and iamge content', async () => {
    const tree = fromMarkdown('![alt1](qrcode:test1)\ntest1');
    const c: Content[] = tree.children[0].children as Content[];
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('image-scheme');
    expect(sel.qrContent).toEqual([c[0]]);
  });
  it('should return "image-dummy" and iamge content', async () => {
    const tree = fromMarkdown(
      '![qrcode:test2](/path/to/mdast-qrcode.png)\ntext2'
    );
    const c: Content[] = tree.children[0].children as Content[];
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('image-dummy');
    expect(sel.qrContent).toEqual([c[0]]);
  });
  it('should return "link-image-dummy" and iamge content', async () => {
    const tree = fromMarkdown(
      '[![alt3](/path/to/mdast-qrcode.png)](url3)\ntext3'
    );
    const c: Content[] = tree.children[0].children as Content[];
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('link-image-dummy');
    expect(sel.qrContent).toEqual([c[0]]);
  });
  it('should not return "link-image-dummy" and iamge content', async () => {
    const tree = fromMarkdown('[![alt44(/path/to/qrcode.png)](url4)\ntext4');
    const c: Content[] = tree.children[0].children as Content[];
    const sel = selectTarget(c, 0);
    expect(sel.kind).toEqual('');
    expect(sel.qrContent.length).toEqual(0);
  });
});
