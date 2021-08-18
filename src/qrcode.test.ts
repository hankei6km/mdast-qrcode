import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode';

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
});
