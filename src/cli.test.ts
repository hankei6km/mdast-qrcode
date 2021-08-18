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
      '---\ntitle: title1\n---\n\n# test1\n\n![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAABmJLR0QA/wD/AP+gvaeTAAACQElEQVR4nO3dwW6kQAwA0WWV//9lcu8DjmW7aUr1rkmYjEoti2lgrvu+73/C+P/2P6BeBoUxKIxBYQwKY1AYg8IYFMagMAaFMSiMQWEMCmNQGIPC/FQPcF1Xx//xZ+v27fr60fZu9fenVbenXaEwBoUxKEx5hq66L1GKZlh1ZmZn6u73l+UKhTEojEFh2mfoKjsjpi8T7p5Zp70/VyiMQWEMCjM+Q6ft/qz1dK5QGIPCGBTm8zN0lT3Po81gVyiMQWEMCjM+Q097hEN2/zNy2vtzhcIYFMagMO0z9LTzuu5rik57fytXKIxBYQwKU56hp52HRU67BqibKxTGoDAGhWm/P7S6HxmdJ2aPF6m+Xvb4q+7Pll2hMAaFMSjM1f3M+epMfHsGd99vWn29LFcojEFhDArz+v2h3TN2emZGP397P9UVCmNQGIPCtJ+Hhi+4+Tyte8ZVr0ma5gqFMSiMQWGOf17u6cff/fzeiCsUxqAwBoX5/HW53furVdmZ6n6oHhkUxqAwx5+HrrLPhK+e500/Y94ZqkcGhTEoDO57W7LXAEXHi/6+OtO7uUJhDApjUJjXr8tddd/b0v372Z9Hn926H6pHBoUxKMznnzk/fU1Pdabv/qzbFQpjUBiDwnx+hlZN38+5+5omVyiMQWEMCoP73pbpZ8rv3t/McoXCGBTGoDCf/96W6mex0/eHRtwP1SODwhgUZvtzijTLFQpjUBiDwhgUxqAwBoUxKIxBYQwKY1AYg8IYFMagMAaFMSjML7ld9PiTOS1MAAAAAElFTkSuQmCC)\ntest1\n\n---\n\n# page2\n\n-   item1\n-   item2\n'
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
