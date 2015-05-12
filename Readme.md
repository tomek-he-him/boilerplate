1) Clone this repository:

```sh
$ git clone git@git.sb12.de/js/lib/boilerplate.git [my repo name]
```


2) Add your real remote:

```sh
$ cd [my repo name]
$ git remote rename origin boilerplate
$ git remote add origin [my remote address]
```


3) Check out boilerplate files:

```sh
$ git checkout boilerplate
```


4) Squash the history into a single initial commit on a new `master` branch:

```sh
$ git branch -D master
$ git checkout --orphan master
$ git commit --message='Boom!'
```


5) Push your way through!

```sh
$ git push --set-upstream origin master
```
