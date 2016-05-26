const fs = require('fs');

module.exports = (params) => () => {
  const manifest = {
    name: params.answers.name,
    title: params.answers.title,
    version: '',
    coreClientVersion: '',
    coreApiVersion: '',
    description: params.answers.description,
    source: `apps/${params.answers.name}/${params.answers.name}.html`,
  };
  const stringified = JSON.stringify(manifest, null, '  ');
  fs.writeFileSync(`${params.projectRoot}/manifest.json`, stringified);
  return 'ok';
};
