# Copilot / AI agent instructions — Wells Beach Time

Quick, actionable orientation for an AI coding assistant working in this repo.

1. Big picture
- This repository is a TypeScript monorepo: a React frontend in `projects/client`, a Node/TypeScript backend in `server`, and shared packages under `projects/iso` and `projects/assets`/`shared` used across projects.
- The repo is wired together by a custom monorepo build tool (`node-mono-builder`) and a local NPM registry (Verdaccio) for development. Local packages use the `@wbtdevlocal` scope (see `utility/local-dev` docs).

2. Primary workflows (what you'll need to automate or suggest)

- Local development: the author uses Docker + VSCode Remote Containers. See `utility/local-dev/README.md` for the canonical developer flow.
- Manual Docker commands (run from `utility/local-dev`):
    - `docker-compose -f docker-compose.yaml up -d`
    - `docker-compose -f docker-compose.yaml build`
    - `docker-compose -f docker-compose.yaml down`
    - `docker exec -it wbt-devcode /bin/zsh --login` (connect into dev container)
- Monorepo build/publish (first-time or after git pulls): run in `utility/local-dev/build`:
    - `node mono run build all --pushpull --install`
    - `node mono run build all --pushpull`

3. Local-registry & versioning caveats (important)

- Development publishes packages into Verdaccio. Local package versions are timestamp-based (milliseconds) when republished.
- After pulling others' changes, always re-run the build/publish command above to republish local packages so `npm install` resolves correctly.
- The local registry is configured only for the `@wbtdevlocal` scope; do not try to repoint global registry settings without checking `utility/local-dev` configs.

4. Project-specific patterns and conventions

- TypeScript everywhere: prefer project TS configurations under each package (check `tsconfig.json` at root and per-package).
- CSS-in-JS: `styled-components` is used for styles; follow existing pattern of component-local styled files (see `projects/client/src` components).
- Time handling: `luxon` is the established library — prefer `luxon` idioms over ad-hoc date math.
- UI testing: `Cosmos` is used for component/UI fixtures (see `projects/client/src/test` and `client/src/test` references).

5. Integration points / external APIs

- NOAA and OpenWeather are primary external data sources (see top-level README). Server code that talks to external APIs lives under `server/src/api` and `iso/src/api`.
- When modifying API clients, keep existing serialization/error handling conventions (see `server/src/api/serialization.ts` and `server/src/api/error.ts`).

6. Files to check before making changes (examples)

- Development entrypoints and docker: `utility/local-dev/docker-compose.yaml` and `utility/local-dev/README.md`
- Build tool and publish commands: `utility/local-dev/build/README.md`
- Server API wrappers: `server/src/api/*`
- Shared/time & utility helpers: `iso/src/utility/time.ts`, `iso/src/utility/object.ts`
- Client UI: `projects/client/src` (component patterns, cosmos fixtures)

7. Recommended behavior for code edits and PR suggestions

- Prefer minimal, focused edits that preserve existing public APIs across packages. If changing a package API, update its dependents and bump/publish via the monorepo build flow.
- When adding or changing a package consumer dependency, ensure the build flow publishes a new timestamped version and update `package-lock.json` via the tool commands.
- When suggesting local-run instructions, reference exact dev container and docker-compose commands above and point to `utility/local-dev/README.md`.

8. When tests or CI are absent/unclear

- Run the monorepo build command and the dev docker-compose flow first. If unit/test scripts are missing, search for `test` directories under `server/test` and `projects/client/src/test`.

If anything here is unclear or you want a tighter focus (e.g., only frontend patterns or only the build/publish flow), tell me which area to expand and I'll update this file.
