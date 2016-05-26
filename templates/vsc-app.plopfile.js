
const name = require('./_/prompts/name');
const title = require('./_/prompts/title');
const description = require('./_/prompts/description');
const npmAuthor = require('./_/prompts/npmAuthor');

const noPublic = true;
const confirm = require('./_/prompts/confirm');

const enterProjectRoot = require('./_/actions/enterProjectRoot');
const initialCommit = require('./_/actions/initialCommit');
const setupSb12 = require('./_/actions/setupSb12');
const tinyDone = require('./_/actions/tinyDone');

const templates = `${__dirname}/vsc-app`;
const manifest = require('./vsc-app/manifest.js');
const slugBase = 'html5/project/vw/vsccore/app';
const confSlug = 'html5/project';

module.exports = (plop) => {
  plop.setGenerator('vsc-app', {
    description: 'An JS App for VSC-Core.',

    prompts: [
      name({ what: 'app' }),
      title({ what: 'app' }),
      description,
      npmAuthor,
      confirm({ slugBase, noPublic }),
    ],

    actions: (answers) => {
      if (!answers.ok) process.exit();

      const projectRoot = `${process.cwd()}/${answers.name}`;

      const fileActions = [
        '.build',
        '.gitignore',
        '{{{ name }}}.html',
        'Makefile',
      ].map((filename) => ({
        type: 'add',
        path: `${projectRoot}/${filename}`,
        templateFile: `${templates}/${filename}`,
      }));

      return fileActions.concat([
        enterProjectRoot({ projectRoot }),
        manifest({ projectRoot, answers }),
        initialCommit,
        setupSb12({ answers, projectRoot, slugBase, confSlug }),
        tinyDone({ answers }),
      ]);
    },
  });
};
