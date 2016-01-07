#!/usr/bin/fish

if begin
  test (count $argv) -lt 2
  or test $argv[1] = '--help'
end
  echo 'Usage: ./_bootstrap.sh NAME DESCRIPTION [TITLE [REPO]]'
  exit 0
  end

set name $argv[1]
set description $argv[2]

if test (count $argv) -lt 3; set title $name
else; set title $argv[3]
end

if test (count $argv) -lt 4; set repo "git@github.com:studio-b12/$name"
else; set repo $argv[4]
end

echo \n'Renaming remotes…'
git remote rename origin boilerplate
git remote add origin $repo
and echo '…done.'
or echo '…failed!'

echo \n'Doing the initial commit…'
if test (count (git branch --list master)) -gt 0
  git branch -D master
  else; true
  end
and git checkout --orphan master
and git commit -m 'Boom!'
and echo '…done.'
or echo '…failed!'

echo \n'Updating name and description…'
for file in package.json Readme.md
  sed --in-place \
    -e "s|<\!--name-->|$name|g" \
    -e "s|<\!--description-->|$description|g" \
    -e "s|<\!--title-->|$title|g" \
    -e 's|<\!--title-underline-->|'(echo -n $title | sed s/./=/g)'|g' \
    -e "s|<\!--repo-->|$repo|g" \
    $file
  end
and git commit -m 'Update name and description' package.json Readme.md
and echo '…done.'
or echo '…failed!'

echo \n'Bootstrapping dependencies…'
npm install --save  \
  chalk  \
  minimist
and npm install --save-dev  \
  1-liners  \
  eslint  \
  eslint-config-airbnb  \
  nodangel  \
  tap-spec@2  \
  tape-catch  \
  tape-spawn  \
  tape  \
  opn-cli
and git commit -m 'Bootstrap dependencies' package.json
and touch npm-shrinkwrap.json
and git add npm-shrinkwrap.json
and npm run reshrinkwrap
and echo '…done.'
or echo '…failed!'

echo \n'Removing the bootstrap script…'
git rm _bootstrap.fish
and git commit -m 'Remove the bootstrap script'
and echo '…done.'
or echo '…failed!'

echo \n'Done! Don’t forget to add some keywords to the `package.json`.'
