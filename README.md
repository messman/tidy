# Wells Beach Time

Parts of the Wells Beach area in Wells, Maine are inaccessible at a certain tidal height.
As locals, my family and I have witnessed many a tourist make a long walk from their rental to the beach, with chairs and games in tow,
just to see that they'll have to wait quite awhile before they can spread out on the sand.

This is a mobile-first web app for use by residents and visitors to Wells, Maine to inform beachgoers about the right time
to go out onto the beaches of Wells.

This app uses publicly-available data from NOAA (National Oceanic and Atmospheric Administration) to present the best time(s) of day to go out on the beach, or "beach time".
More specifically, this app checks traditional astronomical tide charts, newer observational forecast systems, and water
level measurements from Portland, Maine, and interprets that data into a (hopefully) accurate water level
for Wells. This water level is compared against a value for the height of the beach itself to learn how much beach is available/accessible.
This app also calculates and presents the times for dusk and dawn. It can only be beach time if there is enough of both beach space and daylight.

Weather conditions (from OpenWeather) are presented alongside the beach times, but "beach time" in this app does not explicitly account for weather.

## Unique Features

- Shows a live diagram of the estimated water level
- Calculates and shows the best time to go out on the beach over a period of 5-6 days by checking water levels and sunrise/sunset
- Uses multiple tide sources (traditional astronomical tide charts, the GoMOFS system, and Portland tidal measurements) for more accurate
  water level and hi/lo predictions
- Share the app via QR code, native sharing, or copy-to-clipboard
- Read FAQs about the tides

## Major Feature To-do & Issues

Features that will be high priority in the future include:

- Support for metric system
- Better support for reporting API failures
- Emergency weather alerts
- Donation system
- More educational information, including images

The developer typically does one major update per year.

## Credits

- Thank you to all the open-source contributors out there. You rock.
- Some icons are courtesy of The Noun Project (for which I hold a license to use without attribution).
- Thank you to the great people at NOAA and NWS for providing free APIs of tide and weather data.

## Tech

This is a React/TypeScript frontend and TypeScript Node.js backend.

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
