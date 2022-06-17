#!/bin/sh
set -euxo pipefail # error safety

# Run this to build a production container for Heroku.
# Run it from the host machine after installing heroku CLI.
# You may need to first get make this file executable with chmod +x {{name of file}}

# Run from any directory; switches context to this script's directory.
cd "$(dirname $0)"
# Now move up to root.
cd ../../../
ROOT_PATH=$(pwd)
echo $ROOT_PATH

HEROKU_APP=wellsbeachtime-api-v4-0
HEROKU_REGISTRY=registry.heroku.com/${HEROKU_APP}/web

DOCKER_BUILDKIT=1 docker build . \
	--file utility/deploy/server/server.Dockerfile \
	--tag "$HEROKU_REGISTRY" \

docker push "$HEROKU_REGISTRY"

heroku container:release web --app "$HEROKU_APP"