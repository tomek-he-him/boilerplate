const chalk = require('chalk');
const child = require('child_process');

const renderArg = (arg) => ` ${/\s/.test(arg)
  ? `'${arg.replace(/'/g, '\\\'')}'`
  : arg
}`;

module.exports = (command, args, options) => {
  process.stdout.write([
    '\n',
    options && options.cwd && chalk.dim(options.cwd) || '',
    ' ❭ ',
    command,
    args ? args.map(renderArg).join('') : '',
    '\n',
  ].join(''));

  const spawnOptions =
    Object.assign({}, options, { stdio: 'inherit' });

  return (command === 'cd'
    ? process.chdir(args[0])
    : child.spawnSync(command, args, spawnOptions)
  );
};
