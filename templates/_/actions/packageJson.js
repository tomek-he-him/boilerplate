const fs = require('fs');

module.exports = (params) => () => {
  const newManifest =
    JSON.stringify(params.manifest(params.answers), null, '  ');
  fs.writeFileSync(`${params.projectRoot}/package.json`, newManifest);

  return 'packageJson: ok';
};
