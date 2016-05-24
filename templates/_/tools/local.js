const path = require('path');

module.exports = (projectPath) => (binary) => (
  path.resolve(`${projectPath}/node_modules/.bin/${binary}`)
);
