import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode';

describe('toDataURL()', () => {
  it('should convert "qrcode:" to DataURL', async () => {
    const tree = fromMarkdown('# test1\n\n![](qrcode:test1)\ntest1');
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# test1\n\n![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKmSURBVO3BQW7EVgwFwX6E7n/ljnfh6gOCNBObYVX8wRqjWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoFw8l4ZtUuiR0KidJ6FROkvBNKk8Ua5RijVKsUS5epvKmJJyonCShU+mS0KmcqLwpCW8q1ijFGqVYo1x8WBLuUPmkJLwpCXeofFKxRinWKMUa5eKPS8L6V7FGKdYoxRrlYhiVO5IwSbFGKdYoxRrl4sNUfpMkdCpPqPwmxRqlWKMUa5SLlyXhN0lCp9IloVM5ScJvVqxRijVKsUa5eEjlL0nCHSp/SbFGKdYoxRrl4qEkdCp3JKFT6ZJwRxLuUOmS8CaVkyR0Kk8Ua5RijVKsUeIPXpSETqVLwonKHUnoVLok3KFykoROpUvCHSpvKtYoxRqlWKNcfFgSTlS6JJyonCThDpWTJJwkoVM5ScInFWuUYo1SrFHiD74oCXeoPJGETuUkCScqXRI6lf9SsUYp1ijFGuXioSR8UhI+KQlPqHRJ6FROktCpPFGsUYo1SrFGuXhI5b+UhBOVb1LpktCpdCpvKtYoxRqlWKNcPJSEb1I5UemS0KncofKmJHQqbyrWKMUapVijXLxM5U1JOFHpknCShBOVkyR0KicqXRI+qVijFGuUYo1y8WFJuEPljiR0KidJ6FROknCShBOVTqVLQqfyRLFGKdYoxRrl4o9T6ZLQqZwkoVPpVO5IQpeEbyrWKMUapVijXPzPqZwk4QmVbyrWKMUapVijXHyYyjepdEnoVE6ScKLSJeE3KdYoxRqlWKNcvCwJ35SETqVTOUnCEypdEu5IQqfyRLFGKdYoxRol/mCNUaxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlH8AuV30+O6ObzcAAAAASUVORK5CYII=)\ntest1\n'
    );
  });
});
