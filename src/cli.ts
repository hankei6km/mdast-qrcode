import { Readable, Writable } from 'stream';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toMarkdown } from 'mdast-util-to-markdown';
import { toImageDataURL } from './qrcode.js';
import { frontmatter } from 'micromark-extension-frontmatter';
import {
  frontmatterFromMarkdown,
  frontmatterToMarkdown
} from 'mdast-util-frontmatter';

type ToMarkdownOptions = {
  bullet?: '-' | '*' | '+';
  closeAtx?: boolean;
  emphasis?: '_' | '*';
  fence?: '~' | '`';
  fences?: boolean;
  incrementListMarker?: boolean;
  listItemIndent?: 'tab' | 'one' | 'mixed';
  quote?: '"' | "'";
  resourceLink?: boolean;
  rule?: '-' | '_' | '*';
  ruleRepetition?: number;
  ruleSpaces?: boolean;
  setext?: boolean;
  strong?: '_' | '*';
  tightDefinitions?: boolean;
};

type Opts = {
  stdin: Readable;
  stdout: Writable;
  stderr: Writable;
  bullet?: ToMarkdownOptions['bullet'];
  rule?: ToMarkdownOptions['rule'];
};

const cli = async ({
  stdin,
  stdout,
  stderr,
  bullet = '-',
  rule = '-'
}: Opts): Promise<number> => {
  try {
    let source = '';
    await new Promise((resolve) => {
      stdin.on('data', (d) => (source = source + d));
      stdin.on('end', () => resolve(source));
    });
    const tree = fromMarkdown(source, {
      extensions: [frontmatter(['yaml', 'toml'])],
      mdastExtensions: [frontmatterFromMarkdown(['yaml', 'toml'])]
    });
    await toImageDataURL(tree);
    stdout.write(
      toMarkdown(tree, {
        bullet,
        rule,
        extensions: [frontmatterToMarkdown(['yaml', 'toml'])]
      })
    );
  } catch (err: any) {
    stderr.write(err.toString());
    stderr.write('\n');
    return 1;
  }
  return 0;
};

export default cli;
