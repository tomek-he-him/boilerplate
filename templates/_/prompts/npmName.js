const npmName = require('npm-name');
const bold = require('chalk').bold;

module.exports = {
  type: 'input',
  name: 'name',
  message: 'What’s the name of your library?',
  validate(name) {
    const done = this.async();
    if (!/^[a-z]+(?:-[a-z]+)*$/.test(name)) {
      done(
        'A good name consists of one or more words (one or more ' +
        'lowercase letters) separated with a single dash. Have another go!'
      ); return;
    }

    npmName(name).then((available) => {
      if (!available) {
        done(
          `${bold(name)} – great name! Unfortunately, it’s already taken ` +
          `by http://npm.im/${name} . Have another go!`
        ); return;
      }

      done(true);
    });
  },
};
