module.exports = {
  type: 'input',
  name: 'keywords',
  message: (
    'Help others find your lib! Add some keywords, space-separated. ' +
    'http://npm.im/keyword-popularity might help you out.'
  ),
  filter: (rawKeywords) => (
    rawKeywords.split(/\s+/)
  ),
  validate: (rawKeywords) => (
    /^[a-z-]+(\s+[a-z-]+)*$/.test(rawKeywords)
    ? true
    : `“${rawKeywords}” – A good keyword consists of lowercase letters ` +
      'and dashes. Come on, add at least one.'
  ),
};
