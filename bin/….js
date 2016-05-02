#! /usr/bin/env node

const flags = require('minimist')(process.argv.slice(2), {
  boolean: true,
});
const files = flags._;

// Print usage

if (flags.h) process.stdout.write(require('./help/usage'));

if (flags.help) process.stdout.write([
  require('./help/synopsis'),
  require('./help/options'),
  require('./help/examples'),
].join('\n\n'));

// Exit early

if (flags.h || flags.help) process.exit(0);

if (!files.length) {  // TODO: Remove if not expecting files
  process.stderr.write(require('./help/usage'));
  process.exit(1);
}

// TODO
