const fs = require('fs');

module.exports = (params) => () => {
  console.log('————————————————» Hey!');
  fs.writeFileSync(
    `${params.projectRoot}/package.json`,
    JSON.stringify(params.manifest(params.answers), null, '  ')
  );
  return 'ok';
};
