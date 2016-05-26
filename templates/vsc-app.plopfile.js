const $ = require('./_/tools/$');

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
const manifest = require('./vsc-app/manifest');
const slugBase = 'html5/project/vw/vsccore/app';
const confSlug = 'html5/project';

module.exports = (plop) => {
  plop.setGenerator('command-line-tool', {
    description: 'A Node.js-based command line tool',

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
        'bin/{{{ name }}}',
        '{{{ name }}}.html',
        'Makefile',
      ].map((filename) => ({
        type: 'add',
        path: `${projectRoot}/${filename}`,
        templateFile: `${templates}/${filename}`,
      }));

      const binarify = () => {
        $('chmod', ['+x',
          `bin/${answers.name}`,
        ]);
        return 'ok';
      };

      return fileActions.concat([
        enterProjectRoot({ projectRoot }),
        manifest({ projectRoot, answers }),
        binarify,
        initialCommit,
        setupSb12({ answers, projectRoot, slugBase, confSlug }),
        tinyDone({ answers }),
      ]);
    },
  });
};
