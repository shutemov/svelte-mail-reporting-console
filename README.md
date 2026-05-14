# Suspicious Mail Reporting Console

Svelte showcase project for a suspicious email reporting and security triage workflow.

The product models a small internal security console where employees can report suspicious mail, analysts can review generated alerts, assign learning, inspect employee risk context, and run a synthetic workload simulation for demo scenarios.

This is a frontend-first showcase. The server-side layer is intentionally lightweight and uses in-memory mock data instead of a production backend, database, or authentication service. Restarting the app resets the demo state.

## Main Features

- Employee suspicious email report flow.
- Admin alert queue with filters and alert details.
- Dashboard summary for security operations.
- Employee risk profile and learning assignment views.
- Synthetic alert simulation with configurable workload profile.
- Storybook coverage for atoms, molecules, and organisms.

## Local Development

```bash
npm install
npm run dev
```

App: http://127.0.0.1:5173

Storybook:

```bash
npm run storybook
```

Storybook: http://127.0.0.1:6006

## Docker Demo

Run the published GHCR image:

```bash
docker run --rm -p 3000:3000 -e ORIGIN=http://127.0.0.1:3000 ghcr.io/shutemov/svelte-mail-reporting-console:latest
```

Open: http://127.0.0.1:3000

Or build the image locally:

```bash
docker build -t suspicious-mail-reporting-console .
```

Then run the local image:

```bash
docker run --rm -p 3000:3000 -e ORIGIN=http://127.0.0.1:3000 suspicious-mail-reporting-console
```

The Docker image runs the SvelteKit production server with the same in-memory demo backend. It is intended for a quick showcase review, not as a production deployment artifact.

`ORIGIN` should match the URL used in the browser. SvelteKit uses it to validate same-origin form POST requests in production. The demo build also trusts `http://127.0.0.1:3000` and `http://localhost:3000` for local Docker runs.

## Container Publishing

GitHub Actions builds and publishes the image to GitHub Container Registry on every push to `master`.

Published tags:

- `latest` for the current `master` build.
- `sha-<commit>` for an immutable commit image.
