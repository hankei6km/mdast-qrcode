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
