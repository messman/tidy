# Tidy

A mobile-first web app that uses NOAA data to show a simple view of tide information.
Currently only works for **Wells, Maine**. Made for my parents, who live in Wells. 

## Features

- Provides a quick summary view of the last major tide event (low/high) and next major tide event (high/low), the sunrise and sunset of the current day, and current weather information. This information can be copied to your clipboard and shared with others.
- All times are shown local to Wells, Maine, and properly adjust for DST. 
- The site is fully responsive - looks good on your iPhone or on a desktop.
- See an in-depth view of the next 36 hours - expected tide events, sunrise and sunset, and weather all on one timeline.
- See a summary view of the next 6 days.
- Change preferences that remain for future visits to the app - like light/dark theme.

## Feature To-do & Issues

- Allow the user to add their own location, or at least support a few more locations for everyone. (This is tough because I don't want to overwhelm the free government APIs that are used currently. It may be that more locations becomes a pay feature.)
- Add more information like air pressure and water temperature.
- Allow for a custom time (though not all data APIs will support this)

This project is important, but not my top priority - so development will not be quick.

## Credits

- I alone did design (via Sketch) and development (via VSCode) for this project. 
- Thank you to all the open-source contributors out there. You rock.
- Some icons are courtesy of The Noun Project (for which I hold a license to use without attribution).
- Thank you to the great people at NOAA for providing free APIs of tide and weather data.

# Technical Stuff

## Tech

This is a TypeScript frontend and TypeScript Node.js backend. This project is just small enough not to need a monorepo manager (though I did briefly consider using Rush for that purpose).

Some of the major tech used:
- `TypeScript` because, of course.
- `React` because it's beautiful.
- `webpack` for module imports and bundling.
- `styled-components` for writing CSS-in-TypeScript with minimal headaches.
- `luxon` (from `Moment`) for date/time handling.
- `Storybook` for UI testing.

- Deploy with Docker to AWS.
- Add a simple Node service to act as a proxy to NOAA to reduce total API call volume (since all retrieved date is the same).
- Add options for different locations, time spans, etc.

## Build

Tidy is split up into separate packages to facilitate testing and to allow me to cleanly share code between frontend and backend without repeating.

- `tidy-shared`, which holds the common models between client-side and server-side (all hail JavaScript)
- `tidy-server`, which has the server-side code to generate test data and grab our real data from the APIs using `node-fetch`
- `tidy-server-http`, which is a small http server application to expose `tidy-server` for testing (might also be responsible for using `tidy-server` in production if I don't use a serverless solution)
- `tidy-client`, which is the front-end React application.

I don't intend to publish any of these as packages. They are bound together using `npm`'s linking tools, and built with a personal `ts-webpack-builder` project that abstracts common configuration for TypeScript and Webpack libraries.

## Tech Challenges

### npm Linking

This is my first foray into splitting up code for a single project into smaller build-able pieces for testing/organization. I want an environment similar to .NET in Visual Studio, where adding new projects is a breeze. That's easier said than done, as documentation on how to achieve that setup is misleading or out-of-date or sparse.

Eventually, I settled on `npm link`, but there were some problems I encountered:

- Every time you `npm install`, you must re-link your projects (with a command like `npm link tidy-shared && npm link tidy-server`), which gets old.
- Sometimes I run into issues with VSCode's ability to detect the symlink folders and provide accurate TypeScript typings.
- It annoys me that there's no reference to the other packages in the `package.json` file. 

Enter `npm install [file]`, which at least hopefully solves one of those issues.

### Dependencies

I've sunk days into figuring out more about how Node module resolution works and how to keep the dependencies synced up between my different packages. That's exactly what tools like `Rush` and `lerna` and `Bolt` are for, but they are not worth it for this size of project.

### Time

I knew from previous experience that time was hard, but it's made my head spin on this project:

- I'm still not 100% sure how to guarantee that any deploy environment will have the correct information on when DST is (since that's not bundled in Node - or apparently it is, for some versions only). Systems should hold that information, not libraries.
- `luxon` has been a lifesaver over working with the default `Date`, but it's not a piece of cake to figure out. 
- The relationship between client and server with serialization in-between was a big struggle. Initially I was converting server-side `luxon` DateTime objects to native JS Date, then serializing to ISO string, then deserializing back to Date. Then I realized that breaks everything, because the Date objects won't hold the necessary information about a custom zone - they always use the system's zone. Now I use `luxon` throughout with custom serialization to deserialize from string back into `luxon` types. Dirty, but it works.

### Testing

I created a set of functions to help create random test data for everything the API could return. In the end I'm glad I made it, but it may have been overkill. We will see!