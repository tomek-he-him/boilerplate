/* eslint-disable prefer-template */
const reset = require('chalk').reset;

module.exports = (params) => ({
  type: 'input',
  name: 'keywords',
  message: (
    'Help others find your lib! Add some keywords, space-separated.\n' +
    reset(
      'http://npm.im/keyword-popularity might help you out. ' +
      (params.extra
        ? `We’ll add a couple of keywords to the list for you: ${
            params.extra.join(', ')
          }.`
        : ''
      )
    ) +
    '\n  '
  ),
  filter: (rawKeywords) => (
    (params.extra || []).concat(
      rawKeywords.split(/\s+/)
    )
  ),
  validate: (rawKeywords) => (
    /^[a-z-]+(\s+[a-z-]+)*$/.test(rawKeywords)
    ? true
    : `“${rawKeywords}” – A good keyword consists of lowercase letters ` +
      'and dashes. Come on, add at least one.'
  ),
});
