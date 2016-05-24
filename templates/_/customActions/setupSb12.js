const $ = require('../tools/$');
const tmp = require('tmp');
const fs = require('fs');
const u = require('untab');

module.exports = (params) => () => {
  const answers = params.answers;

  const sb12RepoSlug = `js/lib/${answers.name}`;
  const gitoliteAdminDir = tmp.dirSync({ unsafeCleanup: true });
  $('git', ['clone', 'git+ssh://git@git.sb12.de/gitolite-admin.git',
    gitoliteAdminDir.name,
  ]);
  $('cd', [gitoliteAdminDir.name]);
  const confFilePath = `${gitoliteAdminDir.name}/conf/subs/js_lib.conf`;
  const confFile = fs.readFileSync(confFilePath, 'utf8');
  const newConfFile = confFile + u`
    \n\trepo ${sb12RepoSlug}
    \t\tRW+ = @webdev
    \t\tconfig gitweb.owner = "${answers.author.replace(/\s+<.+$/, '')}"
    \t\tconfig gitweb.description = "${
      answers.description
    }. Published at https://github.com/studio-b12/${answers.name} ."
  `;
  fs.writeFileSync(confFilePath, newConfFile);
  $('git', ['commit',
    `--message=New repo: ${sb12RepoSlug}`, confFilePath,
  ]);
  $('git', ['push']);
  $('cd', [params.projectRoot]);
  gitoliteAdminDir.removeCallback();

  $('git', ['remote', 'add', 'origin',
    `git@git.sb12.de:${sb12RepoSlug}.git`,
  ]);
  $('git', ['push', '--set-upstream', 'origin', 'master']);
  return 'ok';
};
