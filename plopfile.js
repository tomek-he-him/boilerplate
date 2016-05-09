const npmName = require('npm-name');
const chalk = require('chalk');
const bold = chalk.bold;
const execa = require('execa');
const parseAuthor = require('parse-author');
const emailRegex = require('email-regex');

const projectRoot = `${__dirname}/..`;
const templates = `${__dirname}/templates`;

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
        rawKeywords
          .trim()
          .split(/\s+/)
          .map(keyword => `\n    "${
            keyword
              .replace(/\\/, '\\\\')
              .replace(/"/, '\\"')
          }"`)
          .join(',')
      ),
    }, {
      type: 'input',
      name: 'repoSlug',
      message: 'What’s the github repo slug?',
      default: (answers) => (
        `studio-b12/${answers.name}`
      ),
    }],

    actions: () => [
      '.editorconfig', '.eslintrc', '.gitignore', '.travis.yml',
      'Contributing.md', 'License.md', 'package.json', 'Readme.md', 'test.js',
    ].map((filename) => ({
      type: 'add',
      path: `${projectRoot}/${filename}`,
      templateFile: `${templates}/${filename}`,
    })),
  });
};
