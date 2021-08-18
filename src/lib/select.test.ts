import { Content } from 'mdast';
import fromMarkdown from 'mdast-util-from-markdown';
import { selectTarget } from './select';

describe('toDataURL()', () => {
  it('should return "image-scheme" and iamge content', async () => {
    const tree = fromMarkdown('![alt1](qrcode:test1)\ntest1');
    const c: Content[] = tree.children[0].children as Content[];
    const sel = selectTarget(c, 0);
    expect(sel[0]).toEqual('image-scheme');
    expect(sel[1]).toEqual([c[0]]);
  });
  it('should return "image-dummy" and iamge content', async () => {
    const tree = fromMarkdown(
      '![qrcode:test2](/path/to/mdast-qrcode.png)\ntext2'
    );
    const c: Content[] = tree.children[0].children as Content[];
    const sel = selectTarget(c, 0);
    expect(sel[0]).toEqual('image-dummy');
    expect(sel[1]).toEqual([c[0]]);
  });
  it('should return "link-image-dummy" and iamge content', async () => {
    const tree = fromMarkdown(
      '[![alt3](/path/to/mdast-qrcode.png)](url3)\ntext3'
    );
    const c: Content[] = tree.children[0].children as Content[];
    const sel = selectTarget(c, 0);
    expect(sel[0]).toEqual('link-image-dummy');
    expect(sel[1]).toEqual([c[0]]);
  });
  it('should not return "link-image-dummy" and iamge content', async () => {
    const tree = fromMarkdown('[![alt44(/path/to/qrcode.png)](url4)\ntext4');
    const c: Content[] = tree.children[0].children as Content[];
    const sel = selectTarget(c, 0);
    expect(sel[0]).toEqual('');
    expect(sel[1].length).toEqual(0);
  });
});
