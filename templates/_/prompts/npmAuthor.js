const execa = require('execa');
const parseAuthor = require('parse-author');
const emailRegex = require('email-regex');

module.exports = {
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
};
