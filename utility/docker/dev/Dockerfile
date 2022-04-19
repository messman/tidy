# https://hub.docker.com/_/node/
# Buster Slim (Debian) instead of Alpine, since Alpine 
# doesn't have the necessary packages for postgresql
FROM node:17.9-buster-slim

# Get the verdaccio port from the build arg setting.
ARG ARG_VERDACCIO_PORT

# Set working directory to be the equivalent of the root of this repo.
WORKDIR /usr/src

# Add zsh
RUN apt-get update && apt-get install -y zsh

# Add a .zshrc file so we don't go insane
# Note: we had to exclude this file from the dockerignore.
COPY ./root/utility/docker/dev/.zshrc /root/.zshrc

# Tell VSCode that we want our default shell to be zsh.
ENV SHELL /bin/zsh

# Add git, so that from VSCode we can see changes and commit them.
RUN apt-get update && apt-get install -y git

# Set npm to use the verdaccio server.
RUN npm set registry http://verdaccio:$ARG_VERDACCIO_PORT/
RUN npm set //verdaccio:$ARG_VERDACCIO_PORT/:_authToken fake_no_auth