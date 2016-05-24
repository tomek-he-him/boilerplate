const npmName = require('./_/prompts/npmName');
const description = require('./_/prompts/description');
const npmAuthor = require('./_/prompts/npmAuthor');
const npmKeywords = require('./_/prompts/npmKeywords');
const confirm = require('./_/prompts/confirm');

const enterProjectRoot = require('./_/actions/enterProjectRoot');
const packageJson = require('./_/actions/packageJson');
const npmDependencies = require('./_/actions/npmDependencies');
const initialCommit = require('./_/actions/initialCommit');
const setupGithub = require('./_/actions/setupGithub');
const setupSb12 = require('./_/actions/setupSb12');
const sayWereDone = require('./_/actions/sayWereDone');

const templates = `${__dirname}/command-line-tool`;
const dependencies = require('./command-line-tool/(npm-dependencies)');
const devDependencies = require('./command-line-tool/(npm-dev-dependencies)');
const manifest = require('./command-line-tool/(package-json)');
const slugBase = 'js/cli-tool';

module.exports = (plop) => {
  plop.addHelper('year', () => (new Date()).getFullYear());

  plop.setGenerator('command-line-tool', {
    description: 'A Node.js-based command line tool',

    prompts: [
      npmName({ what: 'tool' }),
      description,
      npmAuthor,
      npmKeywords({ extra: ['command', 'cli'] }),
      confirm({ slugBase }),
    ],

    actions: (answers) => {
      if (!answers.ok) process.exit();

      const projectRoot = `${process.cwd()}/${answers.name}`;

      const fileActions = [
        '.coveralls.yml',
        '.editorconfig',
        '.eslintrc',
        '.gitignore',
        '.travis.yml',
        'bin/{{{ name }}}',
        'Changelog.yaml',
        'Contributing.md',
        'License.md',
        'Readme.md',
        'scripts/manpages',
        'scripts/readme',
        'test.js',
      ].map((filename) => ({
        type: 'add',
        path: `${projectRoot}/${filename}`,
        templateFile: `${templates}/${filename}`,
      }));

      return fileActions.concat([
        enterProjectRoot({ projectRoot }),
        packageJson({ projectRoot, manifest, answers }),
        npmDependencies({ dependencies, devDependencies }),
        initialCommit,
        setupGithub({ answers }),
        setupSb12({ answers, projectRoot, slugBase }),
        sayWereDone({ answers }),
      ]);
    },
  });
};
