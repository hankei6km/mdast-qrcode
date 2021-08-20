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
