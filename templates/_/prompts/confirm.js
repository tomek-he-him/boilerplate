const chalk = require('chalk');

module.exports = (params) => ({
  type: 'confirm',
  name: 'ok',
  message: (answers) => (
`Good job! Here’s a list of things we’re about to do:${chalk.reset(`

  • Create the subdirectory \`${answers.name}\` in your
    current working directory and put a bunch of new files inside.
  • Install and shrinkwrap initial dependencies.
  • Initialize a new git repo in there and create an initial commit.
  • Add ${params.noPublic ? `one git remote – \`origin\`
    at git@git.sb12.de/${params.slugBase}/${answers.name}.git .` :
    `two git remotes – \`origin\`
    at git@git.sb12.de/${params.slugBase}/${answers.name}.git
    and \`github\` at git@github.com:studio-b12/${answers.name}.git .`}
  ${params.noPublic ? '' : '• Initialize a new github repo ' +
  `at https://github.com/studio-b12/${answers.name} .`}
  • Initialize a new git repo
    at git@git.sb12.de:${params.slugBase}/${answers.name} .
  • Try to push stuff to \`origin\`${params.noPublic ? '' : ' and `github`'}.

We’re using http://npm.im/gh for managing github repos. Make sure you have
the right to create new repos at https://github.com/studio-b12 and that you have
SSH access configured (More info: https://git.io/ssh-access). Make sure
you’ve configured the \`github_user\` and \`github_token\`
in your \`~/.gh.json\`. Otherwise, gh will ask you for credentials
and create a github token for you. This is a security threat.

Make sure you have read and write permissions for the repo
git@git.sb12.com:gitolite-config.git .

`)}${chalk.bold('Do you agree with this plan?')}`
  ),
  default: false,
});
