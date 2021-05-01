#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import cli from './cli';

const argv = yargs(hideBin(process.argv))
  .scriptName('md-qr')
  .usage('$0')
  .alias('h', 'help')
  .example(
    'cat foo.md | $0 -- > bar.md',
    'convert "qrcode:" contained image of markdown to DataURL'
  )
  .help().argv;

(async () => {
  process.exit(
    await cli({
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr
    })
  );
})();
