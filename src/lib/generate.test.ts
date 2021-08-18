import { generateQRCode } from './generate';

jest.mock('canvas', () => {
  const mockDrawImage = jest.fn();
  const mockGetContext = jest.fn();
  const mockToDataURL = jest.fn();
  const mockCreateCanvas = jest.fn();
  const mockLoadImage = jest.fn();
  const reset = () => {
    mockDrawImage.mockReset();
    mockGetContext.mockReset();
    mockGetContext.mockReturnValue({ drawImage: mockDrawImage });
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
      50,
      50,
      100,
      100
    ]);
  });
});
