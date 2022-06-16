#!/bin/sh
set -euxo pipefail # error safety

#
# This script runs during Docker build to build the server/web project for production.
# Because it involves local dependencies, there are intricacies.
# We can't just push dependencies to a registry... they would be public. Instead, use tarballs.
#

# Run from any directory. Switches to this directory.
cd "$(dirname $0)"
# Move up to top of repo.
cd ../../../../
ROOT_PATH=$(pwd)
echo $ROOT_PATH

echo 'Bulding server-web for production'

echo 'Build db-bind library'
cd ./projects/db/bind
npm install
npm run build-production
PROJ_DB_BIND_PACKED_PATH="${ROOT_PATH}/projects/db/bind/$(npm pack | tail -n 1)" # Pack into tarball; save path
echo $PROJ_DB_BIND_PACKED_PATH
cd $ROOT_PATH

echo 'Build bridge-iso library'
cd ./projects/bridge/iso
npm install
npm run build-production
PROJ_BRIDGE_ISO_PACKED_PATH="${ROOT_PATH}/projects/bridge/iso/$(npm pack | tail -n 1)" # Pack into tarball; save path
echo $PROJ_BRIDGE_ISO_PACKED_PATH
cd $ROOT_PATH

echo 'Build server-web application'
cd ./projects/server/web
# First, uninstall the libraries. This causes them to not show up in package.json anymore, so they won't fail for not existing.
npm uninstall @wbtdevlocal/db-bind @wbtdevlocal/bridge-iso
# Install everything else.
npm install
# Install those tarballs built above.
npm install $PROJ_DB_BIND_PACKED_PATH $PROJ_BRIDGE_ISO_PACKED_PATH --no-save
npm run build # Just build, no production (for now?)

# TODO - add db migrations

echo 'Build complete'