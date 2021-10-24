import { jest } from '@jest/globals';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toMarkdown } from 'mdast-util-to-markdown';

jest.unstable_mockModule('../src/lib/generate.js', async () => {
  const mockGenerateQRCode = jest.fn();
  const reset = () => {
    mockGenerateQRCode.mockReset();
    mockGenerateQRCode.mockImplementation(
      async (data: any): Promise<string> => {
        return (await jest
          .fn()
          .mockResolvedValue(`data:${data}` as never)()) as string;
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

const { mockGenerateQRCode } = (
  (await import('../src/lib/generate.js')) as any
)._getMocks();
const { addRemoveIdxs, toImageDataURL } = await import('../src/qrcode.js');

afterEach(async () => {
  ((await import('../src/lib/generate.js')) as any)._reset();
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
  it('should pass options from file name(image)', async () => {
    const tree = fromMarkdown(
      '# title7\n\n![alt7:qrcode:test7](/path/to/mdast-qrcode-width-125.png)\ntext7'
    );
    await toImageDataURL(tree);
    expect(mockGenerateQRCode.mock.calls[0][1]).toEqual({
      width: 125,
      color: {}
    });
  });
  it('should pass options from file name(link)', async () => {
    const tree = fromMarkdown(
      '# title8\n\n[![alt8](/path/to/mdast-qrcode-width-125.png)](url8)\ntext8'
    );
    await toImageDataURL(tree);
    expect(mockGenerateQRCode.mock.calls[0][1]).toEqual({
      width: 125,
      color: {}
    });
  });
  it('should pass options from file name(link)', async () => {
    const tree = fromMarkdown(
      '# title10\n\n[![alt10](/path/to/mdast-qrcode-format_type-jpeg.png)](url10)\ntext10'
    );
    await toImageDataURL(tree);
    expect(mockGenerateQRCode.mock.calls[0][2]).toEqual({
      format: { type: 'jpeg' }
    });
  });
});
