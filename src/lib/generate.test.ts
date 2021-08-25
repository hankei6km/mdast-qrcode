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
  it('should generate QRCode with color options', async () => {
    const res = generateQRCode('test data1', {
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    expect(await res).toEqual('check');
    const { mockToDataURL } = require('qrcode')._getMocks();
    expect(mockToDataURL.mock.calls[0]).toEqual([
      'test data1',
      {
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }
    ]);
  });
  it('should generate QRCode as jpeg', async () => {
    const res = generateQRCode(
      'test data1',
      {},
      { format: { type: 'jpeg', quality: 0.3 } }
    );
    expect(await res).toEqual('check');
    const { mockCanvasToDataURL } = require('canvas')._getMocks();
    expect(mockCanvasToDataURL.mock.calls[0]).toEqual(['image/jpeg', 0.3]);
  });
});
