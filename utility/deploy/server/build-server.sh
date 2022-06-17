#!/bin/sh
set -euxo pipefail # error safety

#
# This script runs during Docker build to build the server project for production.
# Because it involves local dependencies, there are intricacies.
# We can't just push dependencies to a registry... they would be public. Instead, use tarballs.
#

# Run from any directory. Switches to this directory.
cd "$(dirname $0)"
# Move up to top of repo.
cd ../../../
ROOT_PATH=$(pwd)
echo $ROOT_PATH

echo 'Bulding server for production'

echo 'Build iso library'
cd ./projects/iso
npm install
npm run build-production
PROJ_ISO_PACKED_PATH="${ROOT_PATH}/projects/iso/$(npm pack | tail -n 1)" # Pack into tarball; save path
echo $PROJ_ISO_PACKED_PATH
cd $ROOT_PATH

echo 'Build server'
cd ./projects/server
# First, uninstall the libraries. This causes them to not show up in package.json anymore, so they won't fail for not existing.
npm uninstall @wbtdevlocal/iso
# Install everything else.
npm install
# Install those tarballs built above.
npm install $PROJ_ISO_PACKED_PATH --no-save
npm run build # Just build, no production (for now?)

echo 'Build complete'