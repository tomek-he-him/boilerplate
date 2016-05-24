const $ = require('../tools/$');

module.exports = (params) => () => {
  $('cd', [params.projectRoot]);
  return 'ok';
};
