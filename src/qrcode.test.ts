import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode';

describe('toDataURL()', () => {
  it('should convert "qrcode:" in url to DataURL', async () => {
    const tree = fromMarkdown('# title1\n\n![alt1](qrcode:test1)\ntext1');
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title1\n\n![alt1](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAABmJLR0QA/wD/AP+gvaeTAAACNElEQVR4nO3dS27DMAwA0aro/a/s7LWIQpCUoum8fX4YCIRj2R7P8zw/wvg9/QVUy6AwBoUxKIxBYQwKY1AYg8IYFMagMAaFMSiMQWEMCmNQmL/sG4wxKr7Hx+bTt6vPz57uPf37olyhMAaFMShMeobOqrcodc/IqN2/L8oVCmNQGIPClM/QWXRG3DaDT/++mSsUxqAwBoVpn6Hd5hn23y/VcYXCGBTGoDDXz9DozFydT719BrtCYQwKY1CY9hm6eybdtgeomisUxqAwBoUpn6G7Z9jqOLL6++z+fVGuUBiDwhgUZtDv9fdte366uUJhDApjUJjt+3Kzx4m7jzOjMzX6+urzsa5QGIPCGBSm/B4L8wyI7uHJzpTT91SIzsxqrlAYg8IYFCY9Q7P3Daqeqbv/u/2286OuUBiDwhgUpvx8aPVMqZ6pp69t6f48VyiMQWEMCnN8T1H1cWP3+dfV561e333fJFcojEFhDApz/B4L3f+lVh/3ZWd0954oVyiMQWEMCnP9c1t271nKck+RQgwKY1CY65/bkp2Zu69l8Z7zCjEojEFh8M9tiX5e9fWqng9VikFhDApz/HxoVva4sdru61lnrlAYg8IYFOb6GVp9Perq/av/K/Y+RXrLoDAGhbn+uS3dx33R85un9zS5QmEMCmNQmOuf27L6/OrrO6OvX/E4VG8ZFMagMMfvsaBarlAYg8IYFMagMAaFMSiMQWEMCmNQGIPCGBTGoDAGhTEojEFhXlQeB+7YmUtZAAAAAElFTkSuQmCC)\ntext1\n'
    );
  });
  it('should convert "qrcode:" in alt to DataURL', async () => {
    const tree = fromMarkdown(
      '# title2\n\n![qrcode:test2](/path/to/mdast-qrcode.png)\ntext2'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title2\n\n![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAABmJLR0QA/wD/AP+gvaeTAAACM0lEQVR4nO3dy07uMAwAYYp4/1cu6z8sguXYSUbzbY9OC4wiq/fnfd/3Sxjfu38ArWVQGIPCGBTGoDAGhTEojEFhDApjUBiDwhgUxqAwBoUxKMxPdgPP86z4Of5tvHw77n/15d3dv1+UKxTGoDAGhUnP0FH3DJvtLzoDZ9s7fUa7QmEMCmNQmOUzdLR6hnVv//T9j1yhMAaFMShM+QytFj0OrT73u5srFMagMAaFuX6GzmYibUbOuEJhDApjUJjyGVo9w1af+41u77QZ7QqFMSiMQWGWz9Du+1hnx6HRf4/u7zSuUBiDwhgUJj1DTzsOm4leD73t93OFwhgUxqAwx10PjZ5r7T7uzO6v+vlWVyiMQWEMCvNk3zm/+txm9D7b7Izs5rMtCjEojEFhjjsOHVXPxOw7GqIzvPrZGlcojEFhDApTfj00OzO6Z1w1j0MVYlAYg8Kkz+X+2WBwZu4+F9z9/2fb83qoPhgUxqAwy2dot+pnW7J/nu53AbpCYQwKY1CY67/bEn02pft50e7vzLhCYQwKY1CY67/bsvt5z9mM7L7HyBUKY1AYg8Jc/92W1fc0VZ8L9jhUIQaFMSjM8c+2RHW/8yB6HOp9uQoxKIxBYXAzdPU76Fdf762+h8kVCmNQGIPCXP/dllH1udvo/jwOVYpBYQwKc/13W6JOf39ulisUxqAwBoW5/vlQfXKFwhgUxqAwBoUxKIxBYQwKY1AYg8IYFMagMAaFMSiMQWEMCvMLxKET662OItcAAAAASUVORK5CYII=)\ntext2\n'
    );
  });
  it('should convert ".+:qrcode:" in alt to DataURL', async () => {
    const tree = fromMarkdown(
      '# title3\n\n![alt3:qrcode:test3](/path/to/mdast-qrcode.png)\ntext3'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title3\n\n![alt3](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAABmJLR0QA/wD/AP+gvaeTAAACMUlEQVR4nO3dzW7DIBAA4VLl/V/ZPZtD6GpZfkbzXaPaqUYIYWOnPc/z/Ajjd/cX0FwGhTEojEFhDApjUBiDwhgUxqAwBoUxKIxBYQwKY1AYg8J8sgdorc34Hv/W377tz1/9ebXs7WlHKIxBYQwKk55De7O3KI3msNVz4ur/L8oRCmNQGIPCTJ9De9E5IjtHjf5+9xxYvQ3aEQpjUBiDwpTPodVmr+Nuf9THEQpjUBiDwlw/h0av1e6+31nNEQpjUBiDwpTPoaet60b3S6NO+/8coTAGhTEozPQ5dPW6rnpf7uh8p3GEwhgUxqAwjfauv9P2+KzmCIUxKIxBYZbvy83ej8ze/xzJXuvNrmt9PlQvBoUxKMxx71jIzjn956c9W1N9LdgRCmNQGIPCLN9TNJpDdr9T4fZ9vY5QGIPCGBQmPYdm14HV9yNnr2ujx4+eL8sRCmNQGIPClF/Lzc4Rozkne+20ep+u90OVYlAYg8Jcvy+3ek9S9njOoUoxKIxBYY7bUzQyex0aPV/2eO4pUohBYQwKc/3vtkSv9c7eMxRdR/rOeYUYFMagMLjfbVl9/Nn7hL2WqxeDwhgUBvfO+d7qfcHR47kvV18ZFMagMNfPobufPVn9vt4RRyiMQWEMCnP977bsfi/Q6HzVc2bPEQpjUBiDwlz/uy0j1evILNeh+sqgMAaFuf75UL05QmEMCmNQGIPCGBTGoDAGhTEojEFhDApjUBiDwhgUxqAwBoX5A3XiD/WFfA+fAAAAAElFTkSuQmCC)\ntext3\n'
    );
  });
  it('should pass tree via resolve', async () => {
    const tree = fromMarkdown('# title4\n\n![alt4](qrcode:test4)\ntext4');
    const qtree = await toImageDataURL(tree);
    expect(toMarkdown(qtree)).toEqual(
      '# title4\n\n![alt4](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAABmJLR0QA/wD/AP+gvaeTAAACOElEQVR4nO3dyVIDMQwAUYbi/395OMcX4ZLkpel3JgmhyyVmf973fb+E8b37F1Atg8IYFMagMAaFMSiMQWEMCmNQGIPCGBTGoDAGhTEojEFhfrJv8DxPxe/xZ+Ph29nPj16fff+s7OFpVyiMQWEMCpOeoaPqU5SyM3L3z0eqZ7QrFMagMAaFKZ+ho+4ZuPvzd3+/kSsUxqAwBoVpn6Hddu97PY0rFMagMAaFuX6GZtEuj3WFwhgUxqAw7TO0e0ZF253d26mnzWBXKIxBYQwKUz5Dd+9LzZ53G83E3d8v4gqFMSiMQWHSM/S07bDqa1VO+34RVyiMQWEMCnP8ebmz24mzn989Y1fPbFcojEFhDApTfo+FaAasvh4zmpGrZ2b38VlXKIxBYQwKs/y83OzMGGdQ94zt3i6u3lfsCoUxKIxBYcqPh3Yfj5zdzptVvR1d/fqIKxTGoDAGhWm/19/q45nR61cfv6z+e0RcoTAGhTEozHP7M7i7973Ofl708xHPKdIHg8IYFCY9Q297rkl2Bmb3LbsdqikGhTEoDO65LZHV91hY/T+GKxTGoDAGhTn++tDZ96++dub0a1lGrlAYg8IYFObf3XN+9XZt977bkSsUxqAwBoXBzdDu83hP2+4cuUJhDApjUJjrn9vSfY/40+8xP3KFwhgUxqAwuOe2RLrv0bD6WpuRKxTGoDAGhbn++lB9coXCGBTGoDAGhTEojEFhDApjUBiDwhgUxqAwBoUxKIxBYQwK8wu3CQDsf7MJ1gAAAABJRU5ErkJggg==)\ntext4\n'
    );
  });
  it('should convert the url of link that surround dummy image to DataURL', async () => {
    const tree = fromMarkdown(
      '# title5\n\n[![alt5](/path/to/mdast-qrcode.png)](url5)\ntext5'
    );
    await toImageDataURL(tree);
    expect(toMarkdown(tree)).toEqual(
      '# title5\n\n[![alt5](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAABmJLR0QA/wD/AP+gvaeTAAACM0lEQVR4nO3dy26sQAwA0RDl/3+Z7L2YjmW7oSt1tndmBCr1tSA8rvu+7y9hfD+9AeplUBiDwhgUxqAwBoUxKIxBYQwKY1AYg8IYFMagMAaFMSjMT/UHruvq2I4/y/75drV9q997+/5FrlAYg8IYFKY8Q6PuS5SyMyx+Pm5P/PfV56On92/FFQpjUBiDwrTP0Cg7I7qPM6ePI6f3L8sVCmNQGIPCjM/Q3bLnZmm39rhCYQwKY1CY42cobQZWuUJhDApjUJjxGfr0jJs+l/v0/kWuUBiDwhgUpn2G7r6OtXpNUPb7u/cvyxUKY1AYg8Jc9Gf9ve2an2muUBiDwhgUZvvfQ7P3a1bv76x+Pqt7e7NcoTAGhTEoTPk4NHs/ZnVGVq+r7T4u7d6/KlcojEFhDArTfi73tOf6TD/HaPdMdYXCGBTGoDDjzynqnhlvu862e8ZWuUJhDApjUJjxc7nZ73erbs/097uf+eAKhTEojEFhyseh1f/zp8/Frj6/e8ZGHofqI4PCGBTm3723pfuZ8tVrqrq5QmEMCmNQmOPf21K9Dvjpmee5XH1kUBiDwuDf25L9fvc1Udnfq3KFwhgUxqAwxz9zPuq+P7X79z2XqxSDwhgU5vgZWp1Z3TN1xftDlWJQGIPC4N/bEu1+TtFurlAYg8IYFOb497ZkdZ+Lfdvzel2hMAaFMSgM/r0t/40rFMagMAaFMSiMQWEMCmNQGIPCGBTGoDAGhTEojEFhDApjUJhfGdML22SYZUUAAAAASUVORK5CYII=)](url5)\ntext5\n'
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
