const npmName = require('npm-name');
const chalk = require('chalk');
const bold = chalk.bold;
const dim = chalk.dim;
const execa = require('execa');
const parseAuthor = require('parse-author');
const emailRegex = require('email-regex');
const child = require('child_process');
const path = require('path');
const tmp = require('tmp');
const u = require('untab');
const fs = require('fs');

const templates = `${__dirname}/js-library`;
const devDependencies = require('./js-library/(npm-dev-dependencies)');
const manifest = require('./js-library/(package-json)');

const renderArg = (arg) => ` ${/\s/.test(arg)
  ? `'${arg.replace(/'/g, '\\\'')}'`
  : arg
}`;

const $ = (command, args, options) => {
  process.stdout.write([
    '\n',
    options && options.cwd && dim(options.cwd) || '',
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

const local = (binary) => (
  path.resolve(`${__dirname}/../node_modules/.bin/${binary}`)
);

module.exports = (plop) => {
  plop.addHelper('year', () => (new Date()).getFullYear());

  plop.setGenerator('js-library', {
    description: 'A generic JS library',

    prompts: [{
      type: 'input',
      name: 'name',
      message: 'What’s the name of your library?',
      validate(name) {
        const done = this.async();
        if (!/^[a-z]+(?:-[a-z]+)*$/.test(name)) {
          done(
            'A good name consists of one or more words (one or more ' +
            'lowercase letters) separated with a single dash. Have another go!'
          ); return;
        }

        npmName(name).then((available) => {
          if (!available) {
            done(
              `${bold(name)} – great name! Unfortunately, it’s already taken ` +
              `by http://npm.im/${name} . Have another go!`
            ); return;
          }

          done(true);
        });
      },
    }, {
      type: 'input',
      name: 'description',
      message: 'Add a nice description.',
      validate: (description) => ((
        (description.length < 20 &&
          `“${description}” – A bit short, isn’t it? Try to come up ` +
          'with something at least 20 characters long. That’ll help ' +
          'other people find your library.'
        )
      ) || (
        ((
          description[0] !== description[0].toUpperCase() ||
          !/^[^\s]+(?: [^\s]+)+[^.]$/.test(description)
        ) &&
          `“${description}” – Almost there! Please make it into a sentence ` +
          'without a dot at the end. That means two or more words, ' +
          'first of them a capital one.'
        )
      ) || (
        true
      )),
    }, {
      type: 'input',
      name: 'author',
      message: 'Introduce yourself! We need your name and email.',
      default: () => {
        const name = execa.sync('git', ['config', 'user.name']).stdout;
        const email = execa.sync('git', ['config', 'user.email']).stdout;
        return `${name} <${email}>`;
      },
      validate: (rawAuthor) => {
        const author = parseAuthor(rawAuthor);
        if (!author.name || !emailRegex({ exact: true }).test(author.email)) {
          return (
            `“${author}” – almost there! We’re looking for ` +
            'a “name <email>” format.'
          );
        }

        return true;
      },
    }, {
      type: 'input',
      name: 'keywords',
      message: (
        'Help others find your lib! Add some keywords, space-separated. ' +
        'http://npm.im/keyword-popularity might help you out.'
      ),
      filter: (rawKeywords) => (
        rawKeywords.split(/\s+/)
      ),
      validate: (rawKeywords) => (
        /^[a-z-]+(\s+[a-z-]+)*$/.test(rawKeywords)
        ? true
        : `“${rawKeywords}” – A good keyword consists of lowercase letters ` +
          'and dashes. Come on, add at least one.'
      ),
    }, {
      type: 'confirm',
      name: 'ok',
      message: (answers) => (
`Good job! Here’s a list of things we’re about to do:${chalk.reset(`

  • Create the subdirectory \`${answers.name}\` in your
    current working directory and put a bunch of new files inside.
  • Install and shrinkwrap initial depenencies.
  • Initialize a new git repo in there and create an initial commit.
  • Add two git remotes – \`origin\`
    at git@git.sb12.de/js/lib/${answers.name}.git
    and \`github\` at git@github.com:studio-b12/${answers.name}.git .
  • Initialize a new github repo
    at https://github.com/studio-b12/${answers.name} .
  • Initialize a new git repo
    at git@git.sb12.de:js/lib/${answers.name} .
  • Try to push stuff to \`origin\` and \`github\`.

We’re using http://npm.im/gh for managing github repos. Make sure you have
the right to create new repos at https://github.com/studio-b12 and that you have
SSH access configured (More info: https://git.io/ssh-access). Make sure
you’ve configured the \`github_user\` and \`github_token\`
in your \`~/.gh.json\`. Otherwise, gh will ask you for credentials
and create a github token for you. This is a security threat.

Make sure you have read and write permissions for the repo
git@git.sb12.com:gitolite-config.git .

`)}Do you agree with this plan?`
      ),
      default: false,
    }],

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

      // The coming functions are custom actions. Each action has to return
      // a message (see https://github.com/amwmedia/plop/pull/29).

      const enterProjectRoot = () => {
        $('cd', [projectRoot]);
        return 'ok';
      };

      const packageJson = () => fs.writeFileSync(
        `${projectRoot}/package.json`,
        JSON.stringify(manifest(answers), null, '  ')
      );

      const npmDependencies = () => {
        const dependencyStrings =
          Object.keys(devDependencies).map((dep) => (
            `${dep}@${devDependencies[dep]}`
          ));
        $('npm', ['install', '--save-dev', 'npm']);
        $(local('npm'), ['install', '--save-dev'].concat(dependencyStrings));
        $('npm', ['shrinkwrap', '--dev']);
        return 'ok';
      };

      const initialCommit = () => {
        $('git', ['init']);
        $('git', ['add', '.']);
        $('git', ['commit', '--message=Boom!']);
        return 'ok';
      };

      const setupGithub = () => {
        $(local('gh'), [
          'repo', '--new', answers.name, '--organization=studio-b12',
          `--description=${answers.description}`,
        ]);
        $('git', [
          'remote', 'add', 'github',
          `git@github.com:studio-b12/${answers.name}.git`,
        ]);
        $('git', ['push', 'github', 'master']);
        return 'ok';
      };

      const setupSb12 = () => {
        const sb12RepoSlug = `js/lib/${answers.name}`;
        const gitoliteAdminDir = tmp.dirSync({ unsafeCleanup: true });
        $('git', ['clone', 'git+ssh://git@git.sb12.de/gitolite-admin.git',
          gitoliteAdminDir.name,
        ]);
        $('cd', [gitoliteAdminDir.name]);
        const confFilePath = `${gitoliteAdminDir.name}/conf/subs/js_lib.conf`;
        const confFile = fs.readFileSync(confFilePath, 'utf8');
        const newConfFile = confFile + u`
          \n\trepo ${sb12RepoSlug}
          \t\tRW+ = @webdev
          \t\tconfig gitweb.owner = "${answers.author.replace(/\s+<.+$/, '')}"
          \t\tconfig gitweb.description = "${
            answers.description
          }. Published at https://github.com/studio-b12/${answers.name} ."
        `;
        fs.writeFileSync(confFilePath, newConfFile);
        $('git', ['commit',
          `--message=New repo: ${sb12RepoSlug}`, confFilePath,
        ]);
        $('git', ['push']);
        $('cd', [projectRoot]);
        gitoliteAdminDir.removeCallback();

        $('git', ['remote', 'add', 'origin',
          `git@git.sb12.de:${sb12RepoSlug}.git`,
        ]);
        $('git', ['push', '--set-upstream', 'origin', 'master']);
        return 'ok';
      };

      const sayWereDone = () => {
        process.stdout.write(
`
Everything set up! You can now ${bold(`cd ${answers.name}`)}
and start your work there. Good luck!

By the way, here are things you’ll have to do by hand:

  • Go to https://travis-ci.org/profile/studio-b12 , re-sync your repos
    and switch on CI integration for studio-b12/${answers.name}.
  • Go to https://coveralls.io/refresh , switch on coveralls
    for studio-b12/${answers.name} and copy the token into ${
      bold('.coveralls.yml')
    }.
  • Remember to push your changes to both remotes: ${bold('github')} and ${
      bold('origin')
    }.

`
        );
      };

      return fileActions.concat([
        enterProjectRoot,
        packageJson,
        npmDependencies,
        initialCommit,
        setupGithub,
        setupSb12,
        sayWereDone,
      ]);
    },
  });
};
