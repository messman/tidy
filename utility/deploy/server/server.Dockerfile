# PRODUCTION BUILD DOCKERFILE
# Sets up an image with the production build of the application on it, ready to run

# https://hub.docker.com/_/node/
# Buster Slim (Debian) instead of Alpine, to match the codebase environment in dev.
FROM node:16.9.0-buster-slim AS Builder

# Set working directory to be the equivalent of the root of this repo.
WORKDIR /usr/src

# Add zsh (for executing scripts consistently)
RUN apt-get update && apt-get install -y zsh
ENV SHELL /bin/zsh

# Presume context is the root of the repo.
# Copy everything - but note, the dockerignore excludes most.
COPY . ./

# Run npm install and build to get the application assets and bundles
WORKDIR /usr/src/utility/deploy/server
RUN chmod +x ./build-server.sh && /bin/zsh ./build-server.sh

############################################################

# https://hub.docker.com/_/node/
# Buster Slim (Debian) instead of Alpine, since Alpine 
FROM node:16.9.0-buster-slim

# Add zsh (for executing scripts consistently)
RUN apt-get update && apt-get install -y zsh
ENV SHELL /bin/zsh

# Copy our starting script.
WORKDIR /usr/src/wbt
COPY --from=Builder /usr/src/utility/deploy/server/start-server.sh /usr/src/wbt/
RUN chmod +x ./start-server.sh

# We must copy almost the entire directory, unfortunately, since we need node_modules for the app and for tools like pino-seq
COPY --from=Builder /usr/src/projects/server/node_modules /usr/src/wbt/server/node_modules
COPY --from=Builder /usr/src/projects/server/dist /usr/src/wbt/server/dist
COPY --from=Builder /usr/src/projects/server/start.sh /usr/src/wbt/server

# Set the startup script to run when the container starts.
ENTRYPOINT [ "/bin/zsh", "./start-server.sh" ]