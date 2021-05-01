import { Readable, Writable } from 'stream';
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode';
var syntax = require('micromark-extension-frontmatter')
var frontmatter = require('mdast-util-frontmatter')

type Opts = {
  stdin: Readable;
  stdout: Writable;
  stderr: Writable;
};
const cli = async ({ stdin, stdout, stderr }: Opts): Promise<number> => {
  try {
    let source = '';
    await new Promise((resolve) => {
      stdin.on('data', (d) => (source = source + d));
      stdin.on('end', () => resolve(source));
    });
    const tree = fromMarkdown(source, {
      extensions: [syntax(['yaml', 'toml'])],
      mdastExtensions: [frontmatter.fromMarkdown(['yaml', 'toml'])]
    })
    await toImageDataURL(tree);
    stdout.write(toMarkdown(tree, { bullet:'-', rule: '-',
                            extensions: [frontmatter.toMarkdown(['yaml', 'toml'])]
    }));
  } catch (err) {
    stderr.write(err.toString());
    stderr.write('\n');
    return 1;
  }
  return 0;
};

export default cli;
