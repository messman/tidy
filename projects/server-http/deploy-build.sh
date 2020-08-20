#!/bin/bash

# Script executed to prepare for production deploy.
# Run from server-http project folder.
echo 'Install & Prune'
npm install
npm prune

# Build shared library
echo 'Build Shared Library'
cd ../shared
npm install
npm run build-production
SHARED_PATH=$(npm pack | tail -n 1)
echo $SHARED_PATH

# Build server library
echo 'Build Server Library'
cd ../server
npm install
npm install ../shared/$SHARED_PATH --no-save
npm run build-production
SERVER_PATH=$(npm pack | tail -n 1)
echo $SERVER_PATH

# Install shared and server into server-http
echo 'Install Libraries'
cd ../server-http
npm install ../shared/$SHARED_PATH ../server/$SERVER_PATH --no-save

# Build
echo 'Build'
npm run clean
npm run build