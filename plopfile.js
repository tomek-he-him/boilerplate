const projectRoot = `${__dirname}/..`;
const templates = `${__dirname}/templates`;

module.exports = (plop) => {
  plop.addHelper('year', () => (new Date()).getFullYear());

  plop.setGenerator('js-library', {
    description: 'A generic JS library',

    prompts: [{
      type: 'input',
      name: 'name',
      message: 'What’s the name of your library?',
      validate: (name) => (/^[a-z]+(-[a-z]+)*$/.test(name) ?
        true :
        (
          'A good name consists of one or more words (one or more ' +
          'lowercase letters) separated with a single dash'
        )
      ),
    }],

    actions: (data) => [{
      type: 'add',
      path: `${projectRoot}/License.md`,
      templateFile: `${templates}/License.md`,
    }],
  });
}
