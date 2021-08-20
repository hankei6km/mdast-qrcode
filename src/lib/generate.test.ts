import { generateQRCode } from './generate';

const consoleErrror = console.error;

jest.mock('canvas', () => {
  const mockDrawImage = jest.fn();
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
    expect(mockFillRect.mock.calls[0]).toEqual([66, 66, 68, 68]);
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
      70,
      70,
      60,
      60
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
    expect(mockFillRect.mock.calls[0]).toEqual([116, 116, 68, 68]);
    expect(mockDrawImage.mock.calls[0]).toEqual([
      { width: 200, height: 200 },
      0,
      0,
      200,
      200
    ]);
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      120,
      120,
      60,
      60
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
      70,
      82,
      60,
      36
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
      82,
      70,
      36,
      60
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
      50,
      50,
      100,
      100
    ]);
  });
  it('should generate QRCode with logo(padding)', async () => {
    const res = generateQRCode('test data1', 'logo', {}, { padding: 40 });
    expect(await res).toEqual('check');
    const { mockFillRect, mockDrawImage } = require('canvas')._getMocks();
    expect(mockFillRect.mock.calls[0]).toEqual([30, 30, 140, 140]);
    expect(mockDrawImage.mock.calls[1]).toEqual([
      { width: 100, height: 100 },
      70,
      70,
      60,
      60
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
