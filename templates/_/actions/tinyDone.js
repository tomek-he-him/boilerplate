const bold = require('chalk').bold;

module.exports = (params) => () => {
  const name = params.answers.name;

  process.stdout.write(
`
Everything set up! You can now ${bold(`cd ${name}`)}
and start your work there. Good luck!

By the way, here are things you’ll have to do by hand:

  • Push your changes to the remote: ${bold('origin')}.

`
  );

  // We’re not returning anything to prevent plop from rendering
  // its own stuff.
};
