import * as path from 'path';

export function getFileNameFromURL(url: string | undefined): string {
  let ret: string = '';
  try {
    const u = new URL(url || '');
    if (u.protocol === 'https:' || u.protocol === 'http:') {
      ret = path.parse(u.pathname).name;
    }
  } catch (err) {
    ret = path.parse(url || '').name;
  }
  return ret;
}

export function validLogoImageURL(url: string): boolean {
  try {
    const protocol = new URL(url).protocol;
    switch (protocol) {
      case 'http:':
      case 'https:':
      case 'data:':
        return true;
    }
  } catch (err) {
    return false;
  }
  return false;
}
