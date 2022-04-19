# Docker

We can use Docker for two distinct purposes:

1. Development
	- Ability to develop the application on any machine without excessive retooling and setup.
	- Assurance that dev dependencies don't destroy the developer's machine.
	- Ability to run otherwise-platform-specific tools on any OS (e.g., seq on mac).
	- Ability to use simple commands to set up and tear down all pieces of the application (database, logging, caching, server, proxy)
2. Deployment (TBD)
	- "If it runs on my machine, it runs in production."

It's possible to have one without the other. For example, for a simple application without many distinct pieces, one could use docker just for the development side of things but use a script on deploy that builds the production output from github.
Likewise, one could develop without docker but use it for the deployment.

**Right now, we use Docker just for development, and intend to use it for deployment eventually.**

## "For Development"

When we say we are using Docker 'for development', we mean we are creating containers that run on our development machine that have bindings to the source code. That way, as we make changes in our development machine's source directory, the live-running container instantly has that code to use for running or building.

The Docker container can run the scripts we need to affect the state of the codebase - to run installs, clean up code, move between directories, and start applications.

You could always skip Docker and develop on the host machine itself, but that means you'll have to:
- Set environment variables yourself (DB_DEV, etc)
- Use postgres.app to run a local Postgres server
- Run seq in a standalone manner through Docker (see the seq directory for a script)
- Run verdaccio on your host machine
- Make sure you have the right node version and dependencies globally installed
- Possibly do other setup