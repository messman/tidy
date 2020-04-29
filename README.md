# Tidy

A mobile-first web app that uses NOAA data to show a simple view of tide information.

Currently only works for **Wells, Maine**. Made for my parents, who live in Wells.

Technologies used:
- `webpack` for module imports and bundling.
- `babel` for ES2015+.
- `SCSS` for sanity in styling.
- `React` for componentized layouts.
- `TypeScript` for static type checking.

Future goals:
- Deploy with Docker to AWS.
- Add a simple Node service to act as a proxy to NOAA to reduce total API call volume (since all retrieved date is the same).
- Add options for different locations, time spans, etc.

A big thanks to the U.S. government for the [NOAA data](https://tidesandcurrents.noaa.gov/stationhome.html?id=8419317) and [NOAA api](https://tidesandcurrents.noaa.gov/api/).


## Build

Tidy is split up into these packages:
- `tidy-shared`, which holds the common models between client-side and server-side (all hail JavaScript)
- `tidy-server`, which has the server-side code to generate test data and grab our real data from the APIs using `node-fetch`
- `tidy-server-http`, which is a small http server application to expose `tidy-server` for testing (might also be responsible for using `tidy-server` in production if I don't use a serverless solution)
- `tidy-client`, which is the front-end React application.

Local development uses `npm link` to share code. Each individual project is build using my `ts-webpack-builder` project that abstracts common configuration for TypeScript and Webpack libraries.