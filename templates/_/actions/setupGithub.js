const $ = require('../tools/$');
const local = require('../tools/local')(`${__dirname}/../../..`);

module.exports = (params) => () => {
  $(local('gh'), [
    'repo', '--new', params.answers.name, '--organization=studio-b12',
    `--description=${params.answers.description}`,
  ]);
  $('git', [
    'remote', 'add', 'github',
    `git@github.com:studio-b12/${params.answers.name}.git`,
  ]);
  $('git', ['push', 'github', 'master']);
  return 'ok';
};
