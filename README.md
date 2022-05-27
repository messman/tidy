# Wells Beach Time

**Status:** _Version 4 Redesign In-Progress_

A mobile-first web app that uses free & public U.S. government and private data to show a simple view of tide, weather, and sunlight information.
Currently, this application only works for **Wells, Maine**. It was made primarily for my parents, who live in Wells. It is open to use by all.

## Features

- View a quick summary of the last major tide event (low/high) and next major tide event (high/low), the sunrise and sunset of the current day, and current weather information.
- Information can be copied to your clipboard and shared with others.
- All times are shown local to Wells, Maine, and properly adjust for DST. 
- The site is fully responsive - looks good on your iPhone or on a desktop.
- See an in-depth view of the next 36+ hours - expected tide events, sunrise and sunset, and weather all on one full-screen timeline.
- See a summary view of the next 6 days.
- Change preferences that remain for future visits to the app - like light/dark theme.

## Feature To-do & Issues

See the issues section for more information - but features include:

- Allow the user to add their own location, or at least support a few more locations for everyone
- Support for metric system
- Refresh timer
- Changelog system
- Add basic information about how tides work
- Add indication of where the user can interact with components (touch points)

And issues include:

- Optimization!
- Certain iOS bugs
- Ability to view the settings page even when there is an error

This project is important, but not my top priority - so development will not be quick.

## Credits

- Thank you to all the open-source contributors out there. You rock.
- Some icons are courtesy of The Noun Project (for which I hold a license to use without attribution).
- Thank you to the great people at NOAA and NWS for providing free APIs of tide and weather data.

## Tech

This is a TypeScript frontend and TypeScript Node.js backend.

Some of the major tech used:
- `TypeScript` because, of course.
- `React` because it's beautiful.
- `webpack` for module imports and bundling.
- `styled-components` for writing CSS-in-TypeScript with minimal headaches.
- `luxon` (from `Moment`) for date/time handling.
- `Cosmos` for UI testing.

## Build

Wells Beach Time is split up into separate projects to facilitate testing and to allow me to cleanly share code between frontend and backend without repeating.

[node-mono-builder](https://github.com/messman/node-mono-builder) (also by me) is used to bind these projects together with `Verdaccio` and [node-mono-builder](https://github.com/messman/ts-webpack-builder) (also by me).
