import { generateQRCode } from './generate';

const consoleErrror = console.error;

jest.mock('canvas', () => {
  const mockDrawImage = jest.fn();
  const mockBeginPath = jest.fn();
  const mockArc = jest.fn();
  const mockFill = jest.fn();
  const mockFillRect = jest.fn();
  const mockGetContext = jest.fn();
  const mockToDataURL = jest.fn();
  const mockCreateCanvas = jest.fn();
  const mockLoadImage = jest.fn();
  const reset = () => {
    mockDrawImage.mockReset();
    mockFillRect.mockReset();
    mockGetContext.mockReset();
    mockGetContext.mockReturnValue({
      beginPath: mockBeginPath,
      arc: mockArc,
      fill: mockFill,
      drawImage: mockDrawImage,
      fillRect: mockFillRect
    });
    mockToDataURL.mockReset();
    mockToDataURL.mockReturnValue('check');
    mockCreateCanvas.mockReset();
    mockCreateCanvas.mockReturnValue({
      getContext: mockGetContext,
      toDataURL: mockToDataURL
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
      mockFill,
      mockDrawImage,
      mockFillRect,
      mockGetContext,
      mockToDataURL,
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
      mockDrawImage
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
  });
  it('should generate QRCode with logo', async () => {
    const res = generateQRCode('test data1', 'logo');
    expect(await res).toEqual('check');
    const {
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
        margin: 4,
        scale: 4,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }
    ]);
    expect(mockCreateCanvas.mock.calls[0]).toEqual([200, 200]);
    expect(mockFillRect.mock.calls.length).toEqual(1);
    expect(mockFillRect.mock.calls[0]).toEqual([70, 70, 60, 60]);
    expect(mockDrawImage.mock.calls.length).toEqual(2);
    expect(mockDrawImage.mock.calls[0]).toEqual([
      { width: 200, height: 200 },
      0,
      0,
      200,
      200
    ]);
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      74,
      74,
      52,
      52
    ]);
  });
  it('should generate QRCode with logo(right-bottom)', async () => {
    const res = generateQRCode(
      'test data1',
      'logo',
      {},
      { position: 'right-bottom' }
    );
    expect(await res).toEqual('check');
    const { mockFillRect, mockDrawImage } = require('canvas')._getMocks();
    expect(mockFillRect.mock.calls[0]).toEqual([124, 124, 60, 60]);
    expect(mockDrawImage.mock.calls[0]).toEqual([
      { width: 200, height: 200 },
      0,
      0,
      200,
      200
    ]);
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      128,
      128,
      52,
      52
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
      74,
      86,
      52,
      28
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
      86,
      74,
      28,
      52
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
    const res = generateQRCode('test data1', 'logo', {}, { fit: 0 });
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
    const res = generateQRCode('test data1', 'logo', {}, { padding: 10 });
    expect(await res).toEqual('check');
    const { mockFillRect, mockDrawImage } = require('canvas')._getMocks();
    expect(mockFillRect.mock.calls[0]).toEqual([70, 70, 60, 60]);
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      80,
      80,
      40,
      40
    ]);
  });
  it('should generate QRCode with logo(circle)', async () => {
    const res = generateQRCode(
      'test data1',
      'logo',
      {},
      { fillshape: 'circle' }
    );
    expect(await res).toEqual('check');
    const {
      mockBeginPath,
      mockArc,
      mockFill,
      mockFillRect,
      mockDrawImage
    } = require('canvas')._getMocks();
    expect(mockFillRect.mock.calls.length).toEqual(0);
    expect(mockBeginPath.mock.calls.length).toEqual(1);
    expect(mockArc.mock.calls.length).toEqual(1);
    expect(mockFill.mock.calls.length).toEqual(1);
    expect(mockArc.mock.calls[0]).toEqual([
      100,
      100,
      30,
      0,
      2 * Math.PI,
      false
    ]);
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      74,
      74,
      52,
      52
    ]);
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
    const res = generateQRCode('test data1', 'logo', {}, { fit: 0 });
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
