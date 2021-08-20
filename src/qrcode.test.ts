import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { addRemoveIdxs, toImageDataURL } from './qrcode';

jest.mock('./lib/generate', () => {
  const mockGenerateQRCode = jest.fn();
  const reset = () => {
    mockGenerateQRCode.mockReset();
    mockGenerateQRCode.mockImplementation(
      async (data: string): Promise<string> => {
        return await jest.fn().mockResolvedValue(`data:${data}`)();
      }
    );
  };
  reset();
  return {
    generateQRCode: mockGenerateQRCode,
    _reset: reset,
    _getMocks: () => ({
      mockGenerateQRCode
    })
  };
});

afterEach(() => {
  require('./lib/generate')._reset();
});

describe('addRemoveIdxs()', () => {
  it('should add uniqe idx', () => {
    const r = [10, 20];
    addRemoveIdxs(r, [5, 4]);
    addRemoveIdxs(r, [10]);
    addRemoveIdxs(r, [20]);
    addRemoveIdxs(r, [30]);
    expect(r).toEqual([10, 20, 5, 4, 30]);
  });
});

describe('toDataURL()', () => {
  it('should convert "qrcode:" in url to DataURL', async () => {
    const tree = fromMarkdown('# title1\n\n![alt1](qrcode:test1)\ntext1');
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title1\n\n![alt1](data:test1)\ntext1\n'
    );
  });
  it('should convert "qrcode:" in alt to DataURL', async () => {
    const tree = fromMarkdown(
      '# title2\n\n![qrcode:test2](/path/to/mdast-qrcode.png)\ntext2'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual('# title2\n\n![](data:test2)\ntext2\n');
  });
  it('should convert ".+:qrcode:" in alt to DataURL', async () => {
    const tree = fromMarkdown(
      '# title3\n\n![alt3:qrcode:test3](/path/to/mdast-qrcode.png)\ntext3'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title3\n\n![alt3](data:test3)\ntext3\n'
    );
  });
  it('should pass tree via resolve', async () => {
    const tree = fromMarkdown('# title4\n\n![alt4](qrcode:test4)\ntext4');
    const qtree = await toImageDataURL(tree);
    expect(toMarkdown(qtree)).toEqual(
      '# title4\n\n![alt4](data:test4)\ntext4\n'
    );
  });
  it('should convert the url of link that surround dummy image to DataURL', async () => {
    const tree = fromMarkdown(
      '# title5\n\n[![alt5](/path/to/mdast-qrcode.png)](url5)\ntext5'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title5\n\n[![alt5](data:url5)](url5)\ntext5\n'
    );
  });
  it('should not convert the url of link that surround dummy image to DataURL', async () => {
    const tree = fromMarkdown(
      '# title5\n\n[![alt5](/path/to/qrcode.png)](url5)\ntext5'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title5\n\n[![alt5](/path/to/qrcode.png)](url5)\ntext5\n'
    );
  });
  it('should convert "qrcode:" with logo them remove logo contents', async () => {
    const tree = fromMarkdown(
      '# title6\n\ntest6-1\n![alt6](qrcode:test6)\n![](https://hankei6km.github.io/logo.png)\ntext6-2'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title6\n\ntest6-1\n![alt6](data:test6)\ntext6-2\n'
    );
  });
  it('should pass options from file name(image)', async () => {
    const tree = fromMarkdown(
      '# title7\n\n![alt7:qrcode:test7](/path/to/mdast-qrcode-width-125.png)\ntext7'
    );
    await toImageDataURL(tree);
    const { mockGenerateQRCode } = require('./lib/generate')._getMocks();
    expect(mockGenerateQRCode.mock.calls[0][2]).toEqual({
      width: 125,
      color: {}
    });
  });
  it('should pass options from file name(link)', async () => {
    const tree = fromMarkdown(
      '# title8\n\n[![alt8](/path/to/mdast-qrcode-width-125.png)](url8)\ntext8'
    );
    await toImageDataURL(tree);
    const { mockGenerateQRCode } = require('./lib/generate')._getMocks();
    expect(mockGenerateQRCode.mock.calls[0][2]).toEqual({
      width: 125,
      color: {}
    });
  });
  it('should pass logo options from file name(image)', async () => {
    const tree = fromMarkdown(
      '# title9\n\n![alt9:qrcode:test9](/path/to/mdast-qrcode-logo_position-right-bottom.png)\ntext9'
    );
    await toImageDataURL(tree);
    const { mockGenerateQRCode } = require('./lib/generate')._getMocks();
    expect(mockGenerateQRCode.mock.calls[0][3]).toEqual({
      position: 'right-bottom'
    });
  });
  it('should pass options from file name(link)', async () => {
    const tree = fromMarkdown(
      '# title10\n\n[![alt10](/path/to/mdast-qrcode-logo_position-right-bottom.png)](url10)\ntext10'
    );
    await toImageDataURL(tree);
    const { mockGenerateQRCode } = require('./lib/generate')._getMocks();
    expect(mockGenerateQRCode.mock.calls[0][3]).toEqual({
      position: 'right-bottom'
    });
  });
  it('should pass logo options from logo alt(image)', async () => {
    const tree = fromMarkdown(
      '# title11\n\n![alt11:qrcode:test11](/path/to/mdast-qrcode.png)\n![logo_position-right-bottom](https://hankei6km.github.io/logo.png)\ntext11'
    );
    await toImageDataURL(tree);
    const { mockGenerateQRCode } = require('./lib/generate')._getMocks();
    expect(mockGenerateQRCode.mock.calls[0][3]).toEqual({
      position: 'right-bottom'
    });
  });
  it('should pass options from logo alt(link)', async () => {
    const tree = fromMarkdown(
      '# title12\n\n[![alt12](/path/to/mdast-qrcode.png)](url12)\n![logo_position-right-bottom](https://hankei6km.github.io/logo.png)\ntext12'
    );
    await toImageDataURL(tree);
    const { mockGenerateQRCode } = require('./lib/generate')._getMocks();
    expect(mockGenerateQRCode.mock.calls[0][3]).toEqual({
      position: 'right-bottom'
    });
  });
});
