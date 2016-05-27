const $ = require('../tools/$');

module.exports = () => {
  $('git', ['init']);
  $('git', ['add', '.']);
  $('git', ['commit', '--message=Boom!']);

  return 'initialCommit: ok';
};
