#!/bin/bash

# Script executed to prepare for production deploy.
# Run from server-http project folder.
npm install

npm run clean-modules
npm run clean
npm run build

# Build shared library
cd ../shared
npm install
npm run build-production
SHARED_PATH=npm pack | tail -n 1

# Build server library
cd ../server
npm install
npm run build-production
SERVER_PATH=npm pack | tail -n 1

# Install shared and server into server-http
cd ../server-http
npm install $SHARED_PATH
npm install $SERVER_PATH