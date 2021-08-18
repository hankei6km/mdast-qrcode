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
  it('should convert "qrcode:" with logo to DataURL', async () => {
    const stdin = new PassThrough();
    const stdout = new PassThrough();
    const stderr = new PassThrough();
    let outData = '';
    stdout.on('data', (d) => (outData = outData + d));
    let errData = '';
    stderr.on('data', (d) => (errData = errData + d));
    process.nextTick(() => {
      stdin.write(
        '---\ntitle: title1\n---\n\n# test1\n\n![](qrcode:test1)\n![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABxVBMVEX////+9Pb+9ff4rr7ycYzuQ2jsLFXrGUbqEkDqFkPsKFLuO2HxYoD2m6795uvzeJLrHUnqFEHwWXn6ytT//v72mKzqE0Hyaof+8vX+9vjxW3vsJU/xZILzfZb1kKb0hZ3ybortOV/tM1v83OPvS276w87//P384Obzd5LqGETsJlD71t7//f3rGkf4qrv83uTuP2T95er1j6T7ztfwWnrvTG782+LqF0TrHEj7z9j++PrvTW/2ma33obP96OzrI03+8PPvRmr3orT1k6jzfJX5v8vtMlntM1rtL1f709zzdI/71N33qbr4sL/xYH/0hJzxXHzyaIbqFULzdpHrH0rwWHj1iaDwUHLtNVzwUXPtNFz2nbD1jqTya4jsJ1H94+nyaIXvRWnzdY/84uj97fHtN17rIk3xXX396+/4ssH/+/zvSWz5t8XwVnf4tMLybYn70dr5u8jyaYb5vsvtMVntMFj6xND/+vvzepT0f5j6ydT3pbb6zNbyco30gJj/+fvvSm32lKn83uX0g5vrHkrwVXbwUnT4tsTrIEvuQGX4q7zsK1T+7vL84efxYYDsJE7xX371jKL6xdH6x9L2nK/xZoP3qLkktsJBAAACNklEQVRIx91UZ1sTQRBeE4gXIkHxQJSEIvFQjIi9BxErApEoUSOCClgQLBgUFUWs2Bvye513LwlxdxbJNx/nwz03b9k+I8T/G8uWLvV4i4p9yy1/SWBFafDv8mDZSmshVpWvXlxuV+TLEZVrqhbRr13nqqpD4Zrauno3Wd9g1kekIrLBcfPGjZuQN2026KPloLc050FbWwD5tvGG7XK4HX8e2U6AuxxOv3sPUXv3Kej+A3Ac5AxyrEMaHGsiuPWwrm+oJKLN1okjGKhdx48CP8bM7Bwn4oQG2ycBMxMIUYOhTmkrAtrBnt5pdk2dQLtYg11NVLeKxmGIsQZxhqiACvYQmIjyhrPEnVPBXrw5Xi+SmF297POEXTAYSmFQX/lFwlIGwyUY1JrFw2g1GPpQSOr+LqMgHd4QJq6f3dgAb7hC1FUV7IKhmTekiLqmgoMw1OUDub8hvONObZhh1OLCJgav37iZ+fUS4x/SDLWY4lY2G7lN+xx1/9EaxvSFDvgJrx/JZHdk/7iL27qHv/vM1sZBJLPZgzTSiYfiUTHOiCuUIJpeYjSbeiYTuJrwY3yfsKf3VLYlby6fCmT7ZZg/bvFMNtPnuVcznZSdz3oxbTA4Icn3zzS6+ctXryUQtw0GEZ3MrCH1pme8N51r4W9jJod451Pa/ex72c4/GB2emYk8+cf4JyeJC7LGPhst9lTfl8jw13TLt+8/ZBH8RMuy5sTSo+qXZYUK0FPMt3kKMwi7QP2/Hb8BC0lMdjCVM0EAAAAASUVORK5CYII=)\ntest1\n\n---\n\n# page2\n\n- item1\n- item2\n'
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
      '---\ntitle: title1\n---\n\n# test1\n\n![](data:image/png;base64,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)\ntest1\n\n---\n\n# page2\n\n-   item1\n-   item2\n'
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
