import { generateQRCode } from './generate';

const consoleErrror = console.error;

jest.mock('canvas', () => {
  const mockDrawImage = jest.fn();
  const mockBeginPath = jest.fn();
  const mockArc = jest.fn();
  const mockClip = jest.fn();
  const mockClearRect = jest.fn();
  const mockFillRect = jest.fn();
  const mockGetContext = jest.fn();
  const mockCanvasToDataURL = jest.fn();
  const mockCreateCanvas = jest.fn();
  const mockLoadImage = jest.fn();
  const reset = () => {
    mockDrawImage.mockReset();
    mockBeginPath.mockReset();
    mockArc.mockReset();
    mockClip.mockReset();
    mockClearRect.mockReset();
    mockFillRect.mockReset();
    mockGetContext.mockReset();
    mockGetContext.mockReturnValue({
      beginPath: mockBeginPath,
      arc: mockArc,
      clip: mockClip,
      drawImage: mockDrawImage,
      clearRect: mockClearRect,
      fillRect: mockFillRect
    });
    mockCanvasToDataURL.mockReset();
    mockCanvasToDataURL.mockReturnValue('check');
    mockCreateCanvas.mockReset();
    mockCreateCanvas.mockReturnValue({
      getContext: mockGetContext,
      toDataURL: mockCanvasToDataURL
    });
    mockLoadImage.mockReset();
    mockLoadImage
      .mockResolvedValueOnce({
        width: 100,
        height: 100
      })
      .mockResolvedValueOnce({
        width: 200,
        height: 200
      });
  };
  reset();
  return {
    createCanvas: mockCreateCanvas,
    loadImage: mockLoadImage,
    _reset: reset,
    _getMocks: () => ({
      mockBeginPath,
      mockArc,
      mockClip,
      mockDrawImage,
      mockClearRect,
      mockFillRect,
      mockGetContext,
      mockCanvasToDataURL,
      mockCreateCanvas,
      mockLoadImage
    })
  };
});

jest.mock('qrcode', () => {
  const mockToDataURL = jest.fn();
  const reset = () => {
    mockToDataURL.mockReset();
    mockToDataURL.mockResolvedValueOnce('data:qrcode');
  };
  reset();
  return {
    toDataURL: mockToDataURL,
    _reset: reset,
    _getMocks: () => ({
      mockToDataURL
    })
  };
});

afterEach(() => {
  console.error = consoleErrror;
  require('canvas')._reset();
  require('qrcode')._reset();
});

describe('generateQRCode()', () => {
  it('should generate QRCode', async () => {
    const res = generateQRCode('test data1');
    expect(await res).toEqual('check');
    const {
      mockLoadImage,
      mockCreateCanvas,
      mockFillRect,
      mockDrawImage,
      mockCanvasToDataURL
    } = require('canvas')._getMocks();
    const { mockToDataURL } = require('qrcode')._getMocks();
    expect(mockLoadImage.mock.calls.length).toEqual(1);
    expect(mockLoadImage.mock.calls[0][0]).toEqual('data:qrcode');
    expect(mockToDataURL.mock.calls[0]).toEqual([
      'test data1',
      {
        errorCorrectionLevel: 'M',
        margin: 4,
        scale: 4,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }
    ]);
    expect(mockCreateCanvas.mock.calls[0]).toEqual([100, 100]);
    expect(mockFillRect.mock.calls.length).toEqual(0);
    expect(mockDrawImage.mock.calls.length).toEqual(1);
    expect(mockDrawImage.mock.calls[0]).toEqual([
      { width: 100, height: 100 },
      0,
      0,
      100,
      100
    ]);
    expect(mockCanvasToDataURL.mock.calls.length).toEqual(1);
    expect(mockCanvasToDataURL.mock.calls[0]).toEqual(['image/png']);
  });
  it('should generate QRCode with logo', async () => {
    const res = generateQRCode('test data1', 'logo');
    expect(await res).toEqual('check');
    const {
      mockBeginPath,
      mockArc,
      mockClip,
      mockLoadImage,
      mockCreateCanvas,
      mockFillRect,
      mockDrawImage
    } = require('canvas')._getMocks();
    const { mockToDataURL } = require('qrcode')._getMocks();
    expect(mockLoadImage.mock.calls.length).toEqual(2);
    expect(mockLoadImage.mock.calls[0][0]).toEqual('logo');
    expect(mockLoadImage.mock.calls[1][0]).toEqual('data:qrcode');
    expect(mockToDataURL.mock.calls[0]).toEqual([
      'test data1',
      {
        errorCorrectionLevel: 'H',
        width: 300,
        margin: 4,
        scale: 4,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }
    ]);
    expect(mockCreateCanvas.mock.calls[0]).toEqual([200, 200]);
    expect(mockBeginPath.mock.calls.length).toEqual(2);
    expect(mockFillRect.mock.calls.length).toEqual(1);
    expect(mockFillRect.mock.calls[0]).toEqual([65, 65, 70, 70]);
    expect(mockDrawImage.mock.calls.length).toEqual(2);
    expect(mockClip.mock.calls.length).toEqual(2);
    expect(mockArc.mock.calls.length).toEqual(2);
    expect(mockDrawImage.mock.calls[0]).toEqual([
      { width: 200, height: 200 },
      0,
      0,
      200,
      200
    ]);
    expect(mockArc.mock.calls[0]).toEqual([
      100,
      100,
      35,
      0,
      2 * Math.PI,
      false
    ]);
    expect(mockArc.mock.calls[1]).toEqual([
      100,
      100,
      31,
      0,
      2 * Math.PI,
      false
    ]);
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      69,
      69,
      62,
      62
    ]);
  });
  it('should generate QRCode with logo(right-bottom)', async () => {
    const res = generateQRCode(
      'test data1',
      'logo',
      {},
      { logo: { position: 'right-bottom' } }
    );
    expect(await res).toEqual('check');
    const {
      mockArc,
      mockFillRect,
      mockDrawImage
    } = require('canvas')._getMocks();
    expect(mockFillRect.mock.calls[0]).toEqual([58, 58, 70, 70]);
    expect(mockDrawImage.mock.calls[0]).toEqual([
      { width: 200, height: 200 },
      0,
      0,
      200,
      200
    ]);
    expect(mockDrawImage.mock.calls[0]).toEqual([
      { width: 200, height: 200 },
      0,
      0,
      200,
      200
    ]);
    expect(mockArc.mock.calls[0]).toEqual([93, 93, 35, 0, 2 * Math.PI, false]);
    expect(mockArc.mock.calls[1]).toEqual([93, 93, 31, 0, 2 * Math.PI, false]);
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      62,
      62,
      62,
      62
    ]);
  });
  it('should generate QRCode with logo(w > h)', async () => {
    const { mockLoadImage } = require('canvas')._getMocks();
    mockLoadImage.mockReset();
    mockLoadImage
      .mockResolvedValueOnce({
        width: 100,
        height: 60
      })
      .mockResolvedValueOnce({
        width: 200,
        height: 200
      });
    const res = generateQRCode('test data1', 'logo', {}, {});
    expect(await res).toEqual('check');
    const { mockDrawImage } = require('canvas')._getMocks();
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 60 },
      69,
      83,
      62,
      34
    ]);
  });
  it('should generate QRCode with logo(w < h)', async () => {
    const { mockLoadImage } = require('canvas')._getMocks();
    mockLoadImage.mockReset();
    mockLoadImage
      .mockResolvedValueOnce({
        width: 60,
        height: 100
      })
      .mockResolvedValueOnce({
        width: 200,
        height: 200
      });
    const res = generateQRCode('test data1', 'logo', {}, {});
    expect(await res).toEqual('check');
    const { mockDrawImage } = require('canvas')._getMocks();
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 60, height: 100 },
      83,
      69,
      34,
      62
    ]);
  });
  it('should generate QRCode with logo(disable fit)', async () => {
    const { mockLoadImage } = require('canvas')._getMocks();
    mockLoadImage.mockReset();
    mockLoadImage
      .mockResolvedValueOnce({
        width: 100,
        height: 100
      })
      .mockResolvedValueOnce({
        width: 200,
        height: 200
      });
    const res = generateQRCode('test data1', 'logo', {}, { logo: { fit: 0 } });
    expect(await res).toEqual('check');
    const { mockDrawImage } = require('canvas')._getMocks();
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      54,
      54,
      92,
      92
    ]);
  });
  it('should generate QRCode with logo(padding)', async () => {
    const res = generateQRCode(
      'test data1',
      'logo',
      {},
      { logo: { padding: 10 } }
    );
    expect(await res).toEqual('check');
    const {
      mockArc,
      mockFillRect,
      mockDrawImage
    } = require('canvas')._getMocks();
    expect(mockFillRect.mock.calls[0]).toEqual([65, 65, 70, 70]);
    expect(mockArc.mock.calls[1]).toEqual([
      100,
      100,
      25,
      0,
      2 * Math.PI,
      false
    ]);
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      75,
      75,
      50,
      50
    ]);
  });
  it('should generate QRCode with logo(circle)', async () => {
    const res = generateQRCode(
      'test data1',
      'logo',
      {},
      { logo: { fillshape: 'rect' } }
    );
    expect(await res).toEqual('check');
    const {
      mockBeginPath,
      mockArc,
      mockClip,
      mockFillRect,
      mockDrawImage
    } = require('canvas')._getMocks();
    expect(mockFillRect.mock.calls.length).toEqual(1);
    expect(mockBeginPath.mock.calls.length).toEqual(0);
    expect(mockFillRect.mock.calls.length).toEqual(1);
    expect(mockFillRect.mock.calls[0]).toEqual([65, 65, 70, 70]);
    expect(mockArc.mock.calls.length).toEqual(0);
    expect(mockClip.mock.calls.length).toEqual(0);
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      69,
      69,
      62,
      62
    ]);
  });
  it('should generate QRCode with logo(query)', async () => {
    const res = generateQRCode(
      'test data1',
      'https://hankei6km.github.io/logo.png',
      {},
      { logo: { query: 'w=100' } }
    );
    expect(await res).toEqual('check');
    const { mockLoadImage } = require('canvas')._getMocks();
    expect(mockLoadImage.mock.calls[0][0]).toEqual(
      'https://hankei6km.github.io/logo.png?w=100'
    );
  });
  it('should save QRCode to jpeg format', async () => {
    const res = generateQRCode(
      'test data1',
      'https://hankei6km.github.io/logo.png',
      {},
      { format: { type: 'jpeg', quality: 0.5 } }
    );
    expect(await res).toEqual('check');
    const { mockCanvasToDataURL } = require('canvas')._getMocks();
    expect(mockCanvasToDataURL.mock.calls[0]).toEqual(['image/jpeg', 0.5]);
  });
  it('should skip logo image at loadImage failed', async () => {
    const mockConsoleError = jest.fn();
    console.error = mockConsoleError;
    const { mockLoadImage } = require('canvas')._getMocks();
    mockLoadImage.mockReset();
    mockLoadImage
      .mockRejectedValueOnce('load image failed')
      .mockResolvedValueOnce({
        width: 200,
        height: 200
      });
    const res = generateQRCode('test data1', 'logo', {}, { logo: { fit: 0 } });
    expect(await res).toEqual('check');
    expect(mockConsoleError.mock.calls.length).toEqual(1);
    expect(mockConsoleError.mock.calls[0][0]).toEqual(
      'logo loadImage: load image failed'
    );
    const { mockDrawImage } = require('canvas')._getMocks();
    expect(mockDrawImage.mock.calls.length).toEqual(1);
    expect(mockDrawImage.mock.calls[0]).toEqual([
      { width: 200, height: 200 },
      0,
      0,
      200,
      200
    ]);
  });
});
