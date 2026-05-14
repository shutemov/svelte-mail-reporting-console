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

Build the image:

```bash
docker build -t suspicious-mail-reporting-console .
```

Run the container:

```bash
docker run --rm -p 3000:3000 suspicious-mail-reporting-console
```

Open: http://127.0.0.1:3000

The Docker image runs the SvelteKit production server with the same in-memory demo backend. It is intended for a quick showcase review, not as a production deployment artifact.
