const npmName = require('./_/prompts/npmName');
const description = require('./_/prompts/description');
const npmAuthor = require('./_/prompts/npmAuthor');
const npmKeywords = require('./_/prompts/npmKeywords');
const confirm = require('./_/prompts/confirm');

const enterProjectRoot = require('./_/customActions/enterProjectRoot');
const packageJson = require('./_/customActions/packageJson');
const npmDependencies = require('./_/customActions/npmDependencies');
const initialCommit = require('./_/customActions/initialCommit');
const setupGithub = require('./_/customActions/setupGithub');
const setupSb12 = require('./_/customActions/setupSb12');
const sayWereDone = require('./_/customActions/sayWereDone');

const templates = `${__dirname}/js-library`;
const devDependencies = require('./js-library/(npm-dev-dependencies)');
const manifest = require('./js-library/(package-json)');

module.exports = (plop) => {
  plop.addHelper('year', () => (new Date()).getFullYear());

  plop.setGenerator('js-library', {
    description: 'A generic JS library',

    prompts: [
      npmName,
      description,
      npmAuthor,
      npmKeywords,
      confirm,
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
        'License.md',
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
        npmDependencies({ devDependencies }),
        initialCommit,
        setupGithub({ answers }),
        setupSb12({ answers, projectRoot }),
        sayWereDone({ answers }),
      ]);
    },
  });
};
