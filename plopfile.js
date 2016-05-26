const jsLibrary = require('./templates/js-library.plopfile');
const commandLineTool = require('./templates/command-line-tool.plopfile');
const vscApp = require('./templates/vsc-app.plopfile');

module.exports = (plop) => {
  jsLibrary(plop);
  commandLineTool(plop);
  vscApp(plop);
};
