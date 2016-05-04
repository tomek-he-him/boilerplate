module.exports = (plop) => {
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

    actions: [],
  });
}
