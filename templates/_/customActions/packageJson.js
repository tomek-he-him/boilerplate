const fs = require('fs');

module.exports = (params) => () => {
  fs.writeFileSync(
    `${params.projectRoot}/package.json`,
    JSON.stringify(params.manifest(params.answers), null, '  ')
  );
  return 'ok';
};
