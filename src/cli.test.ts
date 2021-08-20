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
