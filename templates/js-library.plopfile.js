const npmName = require('./_/prompts/npmName');
const description = require('./_/prompts/description');
const npmAuthor = require('./_/prompts/npmAuthor');
const npmKeywords = require('./_/prompts/npmKeywords');
const confirm = require('./_/prompts/confirm');

const enterProjectRoot = require('./_/actions/enterProjectRoot');
const packageJson = require('./_/actions/packageJson');
const licenseMd = require('./_/actions/licenseMd');
const npmDependencies = require('./_/actions/npmDependencies');
const initialCommit = require('./_/actions/initialCommit');
const setupGithub = require('./_/actions/setupGithub');
const setupSb12 = require('./_/actions/setupSb12');
const sayWereDone = require('./_/actions/sayWereDone');

const templates = `${__dirname}/js-library`;
const devDependencies = require('./js-library/(npm-dev-dependencies)');
const manifest = require('./js-library/(package.json)');
const license = require('./js-library/(License.md)');
const slugBase = 'js/lib';

module.exports = (plop) => {
  plop.setGenerator('js-library', {
    description: 'A generic JS library',

    prompts: [
      npmName({ what: 'library' }),
      description,
      npmAuthor,
      npmKeywords({}),
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
        'Changelog.yaml',
        'Contributing.md',
        'Readme.md',
        'test.js',
      ].map((filename) => ({
        type: 'add',
        path: `${projectRoot}/${filename}`,
        templateFile: `${templates}/${filename}`,
      }));

      return fileActions.concat([
        enterProjectRoot({ projectRoot }),
        packageJson({ projectRoot, manifest, answers }),
        licenseMd({ projectRoot, license }),
        npmDependencies({ projectRoot, devDependencies }),
        initialCommit,
        setupGithub({ answers }),
        setupSb12({ answers, projectRoot, slugBase }),
        sayWereDone({ answers }),
      ]);
    },
  });
};
