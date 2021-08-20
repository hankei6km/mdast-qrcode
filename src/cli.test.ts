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
    expect(outData).toMatchSnapshot();
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
    expect(outData).toMatchSnapshot();
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
