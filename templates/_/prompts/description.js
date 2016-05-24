module.exports = {
  type: 'input',
  name: 'description',
  message: 'Add a nice description.',
  validate: (description) => ((
    (description.length < 20 &&
      `“${description}” – A bit short, isn’t it? Try to come up ` +
      'with something at least 20 characters long. That’ll help ' +
      'other people find your library.'
    )
  ) || (
    ((
      description[0] !== description[0].toUpperCase() ||
      !/^[^\s]+(?: [^\s]+)+[^.]$/.test(description)
    ) &&
      `“${description}” – Almost there! Please make it into a sentence ` +
      'without a dot at the end. That means two or more words, ' +
      'first of them a capital one.'
    )
  ) || (
    true
  )),
};
