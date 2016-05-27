const $ = require('../tools/$');
const local$ = require('../tools/local');

module.exports = (params) => () => {
  const local = local$(params.projectRoot);

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

  $(local('npm'), ['shrinkwrap', '--dev']);

  return 'npmDependencies: ok';
};
