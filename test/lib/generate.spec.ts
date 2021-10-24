import { generateQRCode } from '../../src/lib/generate.js';

const consoleErrror = console.error;

afterEach(() => {
  console.error = consoleErrror;
});

describe('generateQRCode()', () => {
  it('should generate QRCode', async () => {
    const res = generateQRCode('test data1');
    expect(await res).toMatchSnapshot();
  });
  it('should generate QRCode with color options', async () => {
    const res = generateQRCode('test data1', {
      color: {
        dark: '#ffffff',
        light: '#000000'
      }
    });
    expect(await res).toMatchSnapshot();
  });
});
