const $ = require('../tools/$');
const local = require('../tools/local')(`${__dirname}/../../..`);

module.exports = (params) => () => {
  $('npm', ['install', '--save-dev', 'npm']);

  [
    { deps: params.dependencies, flag: '--save' },
    { deps: params.devDependencies, flag: '--save-dev' },
  ].forEach((item) => {
    if (!item.deps) return;
    const depStrings =
      Object.keys(item.deps).map((dep) => (
        `${dep}@${item.deps[dep]}`
      ));
    $(local('npm'), ['install', item.flag].concat(depStrings));
  });

  $('npm', ['shrinkwrap', '--dev']);

  return 'npmDependencies: ok';
};
