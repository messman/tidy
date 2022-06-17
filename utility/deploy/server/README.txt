# Server Deploy

Deploy happens with Heroku. Eventually we want to deploy via Github Actions, but for now it's local from the host machine via a locally-built Docker image.

## Steps

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli) on your host machine.

1. Run `heroku login`, then `heroku container:login`.

1. Run `zsh ./host-deploy.sh` from this directory.