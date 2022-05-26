# Docker for development

We use Docker for local development with these pieces:

- [Docker Compose](https://docs.docker.com/compose/) to manage the multiple containers we need and the binding mounts (Nginx, Redis, NodeJS) without bothering with Kubernetes.
- VSCode's [Remote Containers extension](https://code.visualstudio.com/docs/remote/containers) to edit code and run a shell in a running Docker container with VS Code (as well as start up with Docker Compose)
- [Verdaccio](https://github.com/verdaccio/verdaccio) and a custom monorepo build manager in `utility/local-dev/build` for managing local monorepo development with `npm`.

## How does one use Docker for development?

For those new to Docker, this can be difficult to wrap one's head around.

Docker can be used in (at least) two ways: as a *build runner* or as a *running environment*. Often, both of these ways are used together.

Docker can be used as a build runner by downloading all the dependencies necessary for your project and running commands in its containerized environment to get to a final resulting package. After running those commands, the Docker container stops.

Docker can be used as a running environment by executing that final resulting package and staying "on" as long as it is executing that package (like a web server) or by staying open until the user stops it.

We use Docker as a running environment for development. Docker downloads all the dependencies we need in image (Nginx, Redis, Node, Verdaccio, npm, etc), and then runs those images. We as developers can use VSCode to edit code in the container, commit code changes, run commands to build the code or start and stop the server, etc.

## Set up on your local machine

Thanks to Docker, this should be trivial to get set up and running on your local machine.

The steps below have been tested for macOS, but not any other platform. Some research may be required.

1. Install and configure git on your machine with your credentials. You may find it useful to install GitHub Desktop.

1. Clone the repository onto your machine. The location does not matter.

1. Install Docker Desktop. Configure it as below. You do *not* need to create a Docker account / log in.

1. Install VSCode. Ensure the "Remote - Containers" extension from Microsoft is installed.

### Docker Desktop configuration

You do not need to sign in or create an account.

Use the following settings:
- `General / Use Docker Compose V2`: ON
- `Resources`: at least 8 GB of memory and 2 CPUs
	- Consider using more resources if you can manage it.
- `Docker Engine`: ensure at least that [BuildKit](https://docs.docker.com/develop/develop-images/build_enhancements/) is on by default. 
```json
{
  // You may have other things here as well...
  // ...

  // Make sure you have this:
  "features": {
    "buildkit": true
  }
}
```

## Running first time and every time

1. Ensure Docker Desktop is running.

1. Open VSCode to the root of the cloned repo on your local machine. VSCode should recognize that the directory can be opened with `Remote - Containers` and prompt you. Accept the suggestion.
	- In future runs, VSCode will show the directory under "Recent" with a title like "_______ [Dev Container]", which will go right into opening the directory with `Remote - Containers`.

1. VSCode will attempt to run `Docker Compose` to start up (and possibly build) the environment.

If failure occurs, you can open the logs to inspect what's wrong.

If it's the very first time you're opening the project after installing/reinstalling Docker or VSCode, consider restarting your machine and trying one more time. 

Otherwise, try to cut VSCode out of the equation temporarily by just attempting to build and start the containers through Docker manually. See the section below on manual `Docker Compose` commands. After success there, stop those containers and try once more with VSCode.

## Verdaccio and registries

(See `#REF_DEV_VERDACCIO` throughout the repo.)

In development, We use Verdaccio as a local registry replacement for `npm`. This tool allows us to publish our locally-developed packages to a local server instead of to the public registry.
Note - we still use `npm`'s CLI and we still use the `npm` registry for all other packages.

We use a local registry as an alternative to `npm link` to avoid issues with dependencies that can be caused by symlinks (symbolic links). Symlinks can cause issues with NodeJS, webpack, Docker, etc that can be difficult to track down. Our custom development build tool (`@messman/node-mono-builder` in the `utility/build` directory) is designed to use a local registry tool like Verdaccio, so most of the time Verdaccio is abstracted away and out of sight of the developer. See the [node-mono-builder repo](https://github.com/messman/node-mono-builder) for more context on why `npm link` wouldn't work well.

### Caveat: local package-lock.json changes

One difference between `npm link` and using a local registry is that the `package-lock.json` file is affected when local projects install and update other local projects (for example, `server` installing `iso`). The build tool publishes a version of the package and installs it in the consumers, and that version must be newer (higher) for every publish (or else `npm update` won't recognize it as new). For consistency, that new version is always the time, in milliseconds, that the package was asked to be published. So, for example, the version of `iso` stored in Verdaccio may update from `1.0.0-1651001123` to `1.0.0-1651004526`. 

These versions only exist on the developer's Verdaccio server in Docker on their machine. They won't be accessible to any other developers. This can cause issues with `npm install` after having worked in changes from git from others. To get around this, **use the build tool to re-build and re-publish your own local versions of packages after working in changes from git**.

For example, use (in the `build` directory) `node mono run build all --pushpull --install`. New versions will be published to Verdaccio and pulled into consumers.

### Setup

In the dev `Dockerfile`, we run commands to set the registry from [the default `https://registry.npmjs.org`](https://docs.npmjs.com/cli/v8/using-npm/config#registry) to a url that used the configured ports and network names in Docker Compose - something like `http://verdaccio:xxxx`.

Specifically, we do this only for the `@wbtdevlocal` scope, which all our packages have. It is important that this scope is unique from any other scopes (like `@messman`) so that only our local packages use the local registry.

You can see this system working correctly by inspecting `package-lock.json` files.

### Resources

- [How the `npm` registry works](https://docs.npmjs.com/cli/v8/using-npm/registry)
	- Note the discussion on 'currently configured registry'.
- [How `.npmrc` works](https://docs.npmjs.com/cli/v8/configuring-npm/npmrc)
- [How `package-lock.json` works](https://docs.npmjs.com/cli/v8/configuring-npm/package-lock-json#dependencies)
	- Note the 'resolved' field and the 'magic value'.
- [verdaccio/verdaccio#515: package-lock.json - resolved field](https://github.com/verdaccio/verdaccio/issues/515)
	- Proof that we can use `.npmrc` to specify a custom registry.

Other resources:
- [https://github.com/npm/cli/issues/3235]
- [https://stackoverflow.com/questions/49404870/how-to-set-auth-for-a-scoped-registry-in-npmrc/51364227#51364227]

## Manual Docker Compose commands

You can use VSCode's Remote Containers to handle spinning up the development containers. VSCode is configured to automatically start the containers (and build them if they don't exist), but re-building and stopping the containers must be done manually (stopping can be done by quitting Docker Desktop).

If you want to *not* use VSCode (perhaps to debug a startup issue), here are the commands to run through a shell on your host machine in the `dev` directory:

```sh
# Start up the docker containers for development.
docker-compose -f docker-compose.yaml up -d

# Build the docker containers for development.
docker-compose -f docker-compose.yaml build

# Connect to the container for development.
docker exec -it wbt-dev-codebase /bin/zsh --login

# Stop the docker containers.
docker-compose -f docker-compose.yaml down
```

So, you'd run the `up` command to spin up the containers and the `down` command to stop them (or stop them via Docker Desktop's UI).


If you want to make scripts, here is a template.

```sh
#!/bin/sh
set -euxo pipefail # error safety

#
# Add comments here on the purpose of this script
#

# Run from any directory; switches context to this script's directory.
cd "$(dirname $0)"

# ... (code here)
```