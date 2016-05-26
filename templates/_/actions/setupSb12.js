const $ = require('../tools/$');
const tmp = require('tmp');
const fs = require('fs');
const u = require('untab');

module.exports = (params) => () => {
  const answers = params.answers;
  const confSlug = params.confSlug || params.slugBase;
  const sb12RepoSlug =
    `${params.slugBase}/${answers.name}`;
  const gitoliteAdminDir =
    tmp.dirSync({ unsafeCleanup: true });
  $('git', ['clone', 'git+ssh://git@git.sb12.de/gitolite-admin.git',
    gitoliteAdminDir.name,
  ]);

  $('cd', [gitoliteAdminDir.name]);
  const confFilePath =
    `${gitoliteAdminDir.name}/conf/subs/${
      confSlug.replace(/\//g, '_')
    }.conf`;
  const confFile =
    fs.readFileSync(confFilePath, 'utf8');
  const newConfFile = !params.confSlug
  ? confFile + u`
    \n\trepo ${sb12RepoSlug}
    \t\tRW+ = @webdev
    \t\tconfig gitweb.owner = "${answers.author.replace(/\s+<.+$/, '')}"
    \t\tconfig gitweb.description = "${
      answers.description
    }. Published at https://github.com/studio-b12/${answers.name} ."
  `
  : confFile + u`
    \n\trepo ${sb12RepoSlug}
    \t\tRW+ = @webdev
    \t\tconfig gitweb.owner = "${answers.author.replace(/\s+<.+$/, '')}"
    \t\tconfig gitweb.description = "${
      answers.description
    }."
    \t\tconfig gitweb.category\t\t= vsf
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
