const currentYear = require('../_/tools/currentYear');

module.exports = (answers) => ({
  name: answers.name,
  version: '0.0.0',
  description: answers.description,
  scripts: {
    coverage: 'rm -rf coverage && istanbul cover test.js',
    coveralls: 'npm run coverage && cat coverage/lcov.info | coveralls',
    develop: 'node-dev --respawn --no-notify --no-deps test.js',
    test: 'eslint . && node test.js',
    reshrinkwrap: [
      'rm -f npm-shrinkwrap.json',
      'npm install',
      'npm shrinkwrap --dev',
      'git commit ' +
        '-m "[npm run shrinkwrap] Update dependencies"' +
        ' npm-shrinkwrap.json package.json',
    ].join(' && '),
  },
  engines: {
    node: '>=4.0.0',
  },
  dependencies: {},
  devDependencies: {},
  files: [
    '/**/*.js',
    '!/test.js',
    '/Readme.md',
    '/License.md',
  ],
  license: 'MIT',
  keywords: answers.keywords,
  author: `© ${currentYear} Studio B12 GmbH (http://studio-b12.de)`,
  contributors: [
    answers.author,
  ],
  repository: {
    type: 'git',
    url: 'https://github.com/studio-b12/${answers.name}.git',
  },
});
