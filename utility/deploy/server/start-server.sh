#!/bin/sh
set -euxo pipefail # error safety

#
# This script runs when the Docker container is started.
# Thus, the directory structure is different.
#

# TODO - run migrations for database first?

echo 'Attempting start...'
cd ./server # move to server directory for correct context
. ./start.sh