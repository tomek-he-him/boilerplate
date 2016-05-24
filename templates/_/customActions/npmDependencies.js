const $ = require('../tools/$');
const local = require('../tools/local')(`${__dirname}/../../..`);

module.exports = (params) => () => {
  const dependencyStrings =
    Object.keys(params.devDependencies).map((dep) => (
      `${dep}@${params.devDependencies[dep]}`
    ));
  $('npm', ['install', '--save-dev', 'npm']);
  $(local('npm'), ['install', '--save-dev'].concat(dependencyStrings));
  $('npm', ['shrinkwrap', '--dev']);
  return 'ok';
};
