# tidy-client

This application is the front-end JS client for the tidy system.

## Build



## Test

You can use local test data straight from `tidy-server` that is created and added in during the build phase.
To do this, set the `data` arg to be parsed by webpack.
Passing no value will use the default randomizer, while any value with pass that value into the randomizer.

From the command line, do something like `npm run dev -- --data`
Or create a package.json script entry like `npm run dev --data`
