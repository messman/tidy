#!/bin/sh
set -euxo pipefail # error safety

# Run this in local-dev to build the static production client app.
# You may need to first get make this file executable with chmod +x {{name of file}}

# Run from any directory; switches context to this script's directory.
cd "$(dirname $0)"
# Now move up to root.
cd ../../../
ROOT_PATH=$(pwd)
echo $ROOT_PATH

cd utility/local-dev/build

node mono run build-production assets iso client --pushpull --install

cd "$ROOT_PATH"

cd ./utility/deploy/client
mkdir -p ./prod-dist
touch ./prod-dist/del.txt
rm -rf ./prod-dist/*

cd ./prod-dist
cp -r "$ROOT_PATH"/projects/assets/dist-icons ./icons
cp -r "$ROOT_PATH"/projects/client/dist/* .

