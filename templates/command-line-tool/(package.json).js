const merge = require('object-merge');
const baseManifest = require('../js-library/(package.json)');

module.exports = (answers) => {
  const base = baseManifest(answers);

  const extra = {
    scripts: {
      manpages: 'scripts/manpages',
      prepublish: 'npm run manpages',
      readme: [
        'scripts/readme',
        'git commit -m \'[npm run readme] Update the docs\' Readme.md',
      ].join(' && '),
    },
    bin: {
      [answers.name]: `bin/${answers.name}`,
    },
    files: base.files.concat([
      '/bin/',
      '/manpages/',
    ]),
    man: [
      `/manpages/${answers.name}.1`,
    ],
  };

  return merge(extra, base);
};
