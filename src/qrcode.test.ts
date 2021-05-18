import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode';

describe('toDataURL()', () => {
  it('should convert "qrcode:" in url to DataURL', async () => {
    const tree = fromMarkdown('# title1\n\n![alt1](qrcode:test1)\ntext1');
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title1\n\n![alt1](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKmSURBVO3BQW7EVgwFwX6E7n/ljnfh6gOCNBObYVX8wRqjWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoFw8l4ZtUuiR0KidJ6FROkvBNKk8Ua5RijVKsUS5epvKmJJyonCShU+mS0KmcqLwpCW8q1ijFGqVYo1x8WBLuUPmkJLwpCXeofFKxRinWKMUa5eKPS8L6V7FGKdYoxRrlYhiVO5IwSbFGKdYoxRrl4sNUfpMkdCpPqPwmxRqlWKMUa5SLlyXhN0lCp9IloVM5ScJvVqxRijVKsUa5eEjlL0nCHSp/SbFGKdYoxRrl4qEkdCp3JKFT6ZJwRxLuUOmS8CaVkyR0Kk8Ua5RijVKsUeIPXpSETqVLwonKHUnoVLok3KFykoROpUvCHSpvKtYoxRqlWKNcfFgSTlS6JJyonCThDpWTJJwkoVM5ScInFWuUYo1SrFHiD74oCXeoPJGETuUkCScqXRI6lf9SsUYp1ijFGuXioSR8UhI+KQlPqHRJ6FROktCpPFGsUYo1SrFGuXhI5b+UhBOVb1LpktCpdCpvKtYoxRqlWKNcPJSEb1I5UemS0KncofKmJHQqbyrWKMUapVijXLxM5U1JOFHpknCShBOVkyR0KicqXRI+qVijFGuUYo1y8WFJuEPljiR0KidJ6FROknCShBOVTqVLQqfyRLFGKdYoxRrl4o9T6ZLQqZwkoVPpVO5IQpeEbyrWKMUapVijXPzPqZwk4QmVbyrWKMUapVijXHyYyjepdEnoVE6ScKLSJeE3KdYoxRqlWKNcvCwJ35SETqVTOUnCEypdEu5IQqfyRLFGKdYoxRol/mCNUaxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlH8AuV30+O6ObzcAAAAASUVORK5CYII=)\ntext1\n'
    );
  });
  it('should convert "qrcode:" in alt to DataURL', async () => {
    const tree = fromMarkdown(
      '# title2\n\n![qrcode:test2](/path/to/mdast-qrcode.png)\ntext2'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title2\n\n![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAK7SURBVO3BQY7cQAwEwUxC//9yeY88NSBIM17TjDA/WGMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRrl4iGVb0rCiUqXhE6lS8KJyjcl4YlijVKsUYo1ysXLkvAmlU9S6ZJwkoQ3qbypWKMUa5RijXLxYSp3JOEOlSeS8ITKHUn4pGKNUqxRijXKxXAq/5NijVKsUYo1ysUwSbhDpUvCv6xYoxRrlGKNcvFhSfgmlTuS8EQSfpNijVKsUYo1ysXLVP6mJHQqXRI6lS4JJyq/WbFGKdYoxRrF/OAfptIl4X9WrFGKNUqxRrl4SKVLQqfypiR0SThROUnCicqbkvBJxRqlWKMUa5SLl6mcJKFT6ZLwhEqXhE6lU7kjCScqd6h0SXiiWKMUa5RijWJ+8IBKl4RO5SQJncpJEjqVO5LQqXRJ6FROktCp3JGENxVrlGKNUqxRLh5KQqfSJeFE5SQJncodSehUTlROkvBEEj6pWKMUa5RijXLxsiScqJwkoVN5UxI6lS4JJypdEk6S0Kl0SXhTsUYp1ijFGuXiy5JwRxJOVE5UuiR8UhI6lROVLglPFGuUYo1SrFHMDx5Q+aYknKjckYROpUvCicpJEjqVLglvKtYoxRqlWKNcvCwJb1I5UemS0Kl0SThJwonKHSrfVKxRijVKsUa5+DCVO5LwSSpdEjqVLgldEjqVkyR0Kp9UrFGKNUqxRrkYRuUOlROVkyR0Kp1Kl4RPKtYoxRqlWKNcDJOEO1S6JHQqdyShU/mmYo1SrFGKNcrFhyXhk5JwonKHyh0qXRL+pmKNUqxRijXKxctUvknlJAknKl0STlS6JHQqXRI6lS4JbyrWKMUapVijmB+sMYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijfIH/hMIBi84V7QAAAAASUVORK5CYII=)\ntext2\n'
    );
  });
  it('should convert ".+:qrcode:" in alt to DataURL', async () => {
    const tree = fromMarkdown(
      '# title3\n\n![alt3:qrcode:test3](/path/to/mdast-qrcode.png)\ntext3'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title3\n\n![alt3](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAK9SURBVO3BQQ7bWAwFwX6E7n/lHi+5+oBgyZMwrIofrDGKNUqxRinWKMUapVijFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1y8aUk/JLKHUnoVLokdCpdEn5J5RvFGqVYoxRrlIuHqTwpCXck4U0qT0rCk4o1SrFGKdYoFy9Lwh0qdyThjiR0Kt9Iwh0qbyrWKMUapVijXAyj0iWhU+mS0Kn8zYo1SrFGKdYoF8Op/EuKNUqxRinWKBcvU/mlJHQqXRI6lW+o/EmKNUqxRinWKBcPS8L/SaVLQqfSJaFTOUnCn6xYoxRrlGKNEj/4iyWhU/mXFWuUYo1SrFEuvpSETqVLwpNUOpWTJJyonCThSSpvKtYoxRqlWKNcfEmlS8KJykkSOpU7knBHEu5QOUnCHUnoVL5RrFGKNUqxRokfvCgJJyonSbhDpUtCp9IloVPpknCi0iXhDpUnFWuUYo1SrFHiBz+UhDtUuiR0Knck4RsqJ0k4UXlTsUYp1ijFGuXiS0n4hspJEu5IwolKl4RO5SQJncqJSpeETuVJxRqlWKMUa5SLL6m8SeUkCZ1Kl4RfUumScJKETuUbxRqlWKMUa5T4wReS8EsqdyThRKVLQqdykoQTlS4JncqTijVKsUYp1igXD1N5UhJOknCHyonKSRLuSMIvFWuUYo1SrFEuXpaEO1TelIROpUtCp9KpdEk4UemS8KZijVKsUYo1ysVwKl0SuiScJOFEpUtCl4RO5U3FGqVYoxRrlIthVLokdCpdEjqVLgl3qHRJ+KVijVKsUYo1ysXLVN6kckcSTpJwotIloVP5PxVrlGKNUqxRLh6WhF9KQqdyotIloVM5SUKn0iWhU+mS0Kk8qVijFGuUYo0SP1hjFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1SrFGKNUqxRinWKMUa5T+8CA78rniNVwAAAABJRU5ErkJggg==)\ntext3\n'
    );
  });
  it('should pass tree via resolve', async () => {
    const tree = fromMarkdown('# title4\n\n![alt4](qrcode:test4)\ntext4');
    const qtree = await toImageDataURL(tree);
    expect(toMarkdown(qtree)).toEqual(
      '# title4\n\n![alt4](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAK5SURBVO3BQW7sWAwEwSxC979yjpdcPUCQusfmZ0T8wRqjWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoFw8l4ZtUnkhCp3KShG9SeaJYoxRrlGKNcvEylTcl4Y4kdCpvUnlTEt5UrFGKNUqxRrn4sCTcoXJHEjqVLgknSehU7kjCHSqfVKxRijVKsUa5GCYJ/7JijVKsUYo1ysU/RqVLwiTFGqVYoxRrlIsPU/lNktCpPKHymxRrlGKNUqxRLl6WhP+TSpeETqVLQqdykoTfrFijFGuUYo0Sf/CHJaFT+ZcVa5RijVKsUS4eSkKn0iXhTSqdykkSTlROkvAmlU8q1ijFGqVYo8Qf/CFJOFE5ScITKidJOFHpktCpPFGsUYo1SrFGuXgoCZ3KHUnoVLoknKicJKFT6ZLQqXRJ6JLQqdyRhE7lTcUapVijFGuU+IMHknCHyicloVPpkvCEykkSTlQ+qVijFGuUYo1y8WVJOFHpktCpnKh0SehUuiR0KidJ6FROVLokdCpvKtYoxRqlWKNcPKTySSonSehUOpVvUumScJKETuWJYo1SrFGKNUr8wQNJ+CaVkyR0Kl0SOpUuCZ3KSRJOVLokdCpvKtYoxRqlWKNcvEzlTUk4SUKn0iWhUzlROUnCHUn4pmKNUqxRijXKxYcl4Q6VJ5LQqXRJ6FS6JHQqnUqXhBOVLgmfVKxRijVKsUa5GEbljiScJOFEpUtCl4RO5ZOKNUqxRinWKBfDJaFT6ZLQqXRJuEOlS8I3FWuUYo1SrFEuPkzlk1S6JHQqXRJOkvCXFWuUYo1SrFEuXpaEb0pCp3Ki0iWhU3kiCZ1Kl4RO5U3FGqVYoxRrlPiDNUaxRinWKMUapVijFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1SrFH+A3hPDvkpvReRAAAAAElFTkSuQmCC)\ntext4\n'
    );
  });
  it('should convert the url of link that surround dummy image to DataURL', async () => {
    const tree = fromMarkdown(
      '# title5\n\n[![alt5](/path/to/mdast-qrcode.png)](url5)\ntext5'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title5\n\n[![alt5](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKiSURBVO3BQY7cQAwEwSxC//9yeo88NTCQtB7TjIg/WGMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRrl4qYk/CaVO5JwotIl4Tep3FGsUYo1SrFGuXiYypOS8CaVT6g8KQlPKtYoxRqlWKNcvCwJn1D5RBI6lS4JncqTkvAJlTcVa5RijVKsUS6GU/mfFGuUYo1SrFEu/jNJOFH5lxVrlGKNUqxRLl6m8k1UuiTcofJNijVKsUYp1igXD0vCN0lCp3JHEr5ZsUYp1ijFGuXiJpVvptIl4RMq/5JijVKsUYo1ysVNSehUuiQ8SaVT+YRKl4STJDxJ5U3FGqVYoxRrlIu/TOUTSThReZJKl4RO5SQJXRJOVO4o1ijFGqVYo1w8LAlPSkKn8okknKh0SehUOpUuCZ1Kp9IloVN5UrFGKdYoxRrl4iaVLgknKl0STlS6JHQqn1A5UTlJwkkS/qZijVKsUYo1ysXLVLokdConSXhSEjqVLgmdSqfSJaFTOUnCm4o1SrFGKdYo8Qf/sCT8JpWTJHQqXRJOVO4o1ijFGqVYo8Qf3JCE36TypCR0Kl0STlROknCi8qRijVKsUYo1ysXDVJ6UhJMkdConSThJwonKHSpvKtYoxRqlWKNcvCwJn1C5IwmdSqfSJaFTOUlCp9IloVPpktCpPKlYoxRrlGKNcrFelYRO5U3FGqVYoxRrlIthVE6S0Kl0SehUOpUuCd+kWKMUa5RijXLxMpU3qXRJ6FQ6lROVkyScqHRJ+E3FGqVYoxRrlIuHJeE3JaFT6ZJwotIloVPpVLokfCIJncqTijVKsUYp1ijxB2uMYo1SrFGKNUqxRinWKMUapVijFGuUYo1SrFGKNUqxRinWKMUapVij/AEL1wbm+HRV1wAAAABJRU5ErkJggg==)](url5)\ntext5\n'
    );
  });
  it('should not convert the url of link that surround dummy image to DataURL', async () => {
    const tree = fromMarkdown(
      '# title5\n\n[![alt5](/path/to/qrcode.png)](url5)\ntext5'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title5\n\n[![alt5](/path/to/qrcode.png)](url5)\ntext5\n'
    );
  });
});
