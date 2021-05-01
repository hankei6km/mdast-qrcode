#!/usr/bin/env node
import * as fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import cli from './cli';

const argv = yargs(hideBin(process.argv))
  .scriptName('mdqr')
  .usage('$0 [options] --')
  .alias('h', 'help')
  .example(
    'cat foo.md | $0 -- > bar.md',
    'convert "qrcode:" contained image of markdown to DataURL'
  )
  .config('settings', function (configPath) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  })
  .config({
    toMarkdown: { bullet: '-', rule: '-' }
  })
  .help().argv;

(async () => {
  const bullet = (argv.toMarkdown as any).bullet;
  const rule = (argv.toMarkdown as any).rule;
  process.exit(
    await cli({
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
      bullet:
        bullet === '-' || bullet === '*' || bullet === '+' ? bullet : undefined,
      rule: rule === '-' || rule === '_' || rule === '*' ? rule : undefined
    })
  );
})();
