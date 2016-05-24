const bold = require('chalk').bold;

module.exports = (params) => () => {
  const name = params.answers.name;

  process.stdout.write(
`
Everything set up! You can now ${bold(`cd ${name}`)}
and start your work there. Good luck!

By the way, here are things you’ll have to do by hand:

  • Go to https://travis-ci.org/profile/studio-b12 , re-sync your repos
    and switch on CI integration for studio-b12/${name}.
  • Go to https://coveralls.io/refresh , switch on coveralls
    for studio-b12/${name} and copy the token into ${
      bold('.coveralls.yml')
    }.
  • Remember to push your changes to both remotes: ${bold('github')} and ${
      bold('origin')
    }.

`
  );

  // We’re not returning anything to prevent plop from rendering
  // its own stuff.
};
