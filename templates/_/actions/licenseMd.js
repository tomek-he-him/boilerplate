const fs = require('fs');

module.exports = (params) => () => {
  fs.writeFileSync(`${params.projectRoot}/License.md`, params.license);

  return 'licenseMd: ok';
};
