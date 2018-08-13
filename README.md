# Quick Tides

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
