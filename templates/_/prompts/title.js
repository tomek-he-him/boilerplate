module.exports = (params) => ({
  type: 'input',
  name: 'title',
  message: `Give a title for your new ${params.what}`,
  validate(name) {
    const done = this.async();
    if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(name)) {
      done(
        'A good title consists of one or more words ' +
        'separated with a single white space. ' +
        'Have another go!'
      ); return;
    }
    done(true);
  },
});
