const jsLibrary = require('./templates/js-library.plopfile');
const commandLineTool = require('./templates/command-line-tool.plopfile');

module.exports = (plop) => {
  jsLibrary(plop);
  commandLineTool(plop);
};
