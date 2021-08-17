import { PassThrough } from 'stream';
import cli from './cli';

describe('cli()', () => {
  it('should convert "qrcode:" to DataURL', async () => {
    const stdin = new PassThrough();
    const stdout = new PassThrough();
    const stderr = new PassThrough();
    let outData = '';
    stdout.on('data', (d) => (outData = outData + d));
    let errData = '';
    stderr.on('data', (d) => (errData = errData + d));
    process.nextTick(() => {
      stdin.write(
        '---\ntitle: title1\n---\n\n# test1\n\n![](qrcode:test1)\ntest1\n\n---\n\n# page2\n\n- item1\n- item2\n'
      );
      stdin.end();
    });
    expect(
      await cli({
        stdin,
        stdout,
        stderr
      })
    ).toEqual(0);
    expect(outData).toEqual(
      '---\ntitle: title1\n---\n\n# test1\n\n![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAABmJLR0QA/wD/AP+gvaeTAAACNElEQVR4nO3dS27DMAwA0aro/a/s7LWIQpCUoum8fX4YCIRj2R7P8zw/wvg9/QVUy6AwBoUxKIxBYQwKY1AYg8IYFMagMAaFMSiMQWEMCmNQmL/sG4wxKr7Hx+bTt6vPz57uPf37olyhMAaFMShMeobOqrcodc/IqN2/L8oVCmNQGIPClM/QWXRG3DaDT/++mSsUxqAwBoVpn6Hd5hn23y/VcYXCGBTGoDDXz9DozFydT719BrtCYQwKY1CY9hm6eybdtgeomisUxqAwBoUpn6G7Z9jqOLL6++z+fVGuUBiDwhgUZtDv9fdte366uUJhDApjUJjt+3Kzx4m7jzOjMzX6+urzsa5QGIPCGBSm/B4L8wyI7uHJzpTT91SIzsxqrlAYg8IYFCY9Q7P3Daqeqbv/u/2286OuUBiDwhgUpvx8aPVMqZ6pp69t6f48VyiMQWEMCnN8T1H1cWP3+dfV561e333fJFcojEFhDApz/B4L3f+lVh/3ZWd0954oVyiMQWEMCnP9c1t271nKck+RQgwKY1CY65/bkp2Zu69l8Z7zCjEojEFh8M9tiX5e9fWqng9VikFhDApz/HxoVva4sdru61lnrlAYg8IYFOb6GVp9Perq/av/K/Y+RXrLoDAGhbn+uS3dx33R85un9zS5QmEMCmNQmOuf27L6/OrrO6OvX/E4VG8ZFMagMMfvsaBarlAYg8IYFMagMAaFMSiMQWEMCmNQGIPCGBTGoDAGhTEojEFhXlQeB+7YmUtZAAAAAElFTkSuQmCC)\ntest1\n\n---\n\n# page2\n\n-   item1\n-   item2\n'
    );
    expect(errData).toEqual('');
  });
  it('should accept options', async () => {
    const stdin = new PassThrough();
    const stdout = new PassThrough();
    const stderr = new PassThrough();
    let outData = '';
    stdout.on('data', (d) => (outData = outData + d));
    let errData = '';
    stderr.on('data', (d) => (errData = errData + d));
    process.nextTick(() => {
      stdin.write(
        '---\ntitle: title2\n---\n\n# test2\n\n- item1\n- item2\n\n---\n\n# page2\n'
      );
      stdin.end();
    });
    expect(
      await cli({
        stdin,
        stdout,
        stderr,
        bullet: '+',
        rule: '*'
      })
    ).toEqual(0);
    expect(outData).toEqual(
      '---\ntitle: title2\n---\n\n# test2\n\n+   item1\n+   item2\n\n***\n\n# page2\n'
    );
    expect(errData).toEqual('');
  });
});
