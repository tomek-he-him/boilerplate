const $ = require('../tools/$');

module.exports = (params) => () => {
  $('cd', [params.projectRoot]);

  return 'enterProjectRoot: ok';
};
