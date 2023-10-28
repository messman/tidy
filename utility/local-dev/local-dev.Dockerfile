# https://hub.docker.com/_/node/
# Buster Slim (Debian) instead of Alpine, since Alpine 
# doesn't have the necessary packages for postgresql (in case we need it)
FROM node:20.9-buster-slim

# Get the verdaccio port from the build arg setting.
ARG ARG_VERDACCIO_PORT

# Add zsh and curl
RUN apt-get update && apt-get install -y zsh && apt-get install -y curl

# Add a .zshrc file so we don't go insane
# Note: we had to exclude this file from the dockerignore.
COPY ./utility/local-dev/.zshrc /root/.zshrc

# Tell VSCode that we want our default shell to be zsh.
ENV SHELL /bin/zsh

# Set working directory to be the equivalent of the root of this repo.
WORKDIR /usr/src

# Add git, so that from VSCode we can see changes and commit them.
RUN apt-get update && apt-get install -y git

# Set npm to use the verdaccio server.
# See #REF_DEV_VERDACCIO
RUN npm config set @wbtdevlocal:registry http://verdaccio:4873/
RUN npm config set //verdaccio:$ARG_VERDACCIO_PORT/:_authToken fake_no_auth