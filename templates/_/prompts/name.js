module.exports = (params) => ({
  type: 'input',
  name: 'name',
  message: `What’s the name of your new ${params.what}?`,
  validate(name) {
    const done = this.async();
    if (!/^[a-z]+(?:[a-zA-Z0-9]+)*$/.test(name)) {
      done(
        'A good name is one word beginning with a lowercase letter and can ' +
        'only contain letters and numbers after that. You can also use ' +
        'camelCase (recommended) for separating words. Have another go!'
      ); return;
    }
    done(true);
  },
});
