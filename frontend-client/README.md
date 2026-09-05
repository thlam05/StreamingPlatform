# StreamingPlatform frontend

Vite + React + TypeScript SPA for the StreamingPlatform product. The project follows the frontend structure and UI conventions established in the SterioX client.

## Stack

- React 19 and React Router
- Vite with Tailwind CSS v4
- Axios for backend requests
- ESLint, Prettier, Husky, and lint-staged

## Getting started

Install dependencies:

```bash
npm install
```

Create a local environment file if one does not exist:

```bash
copy .env.example .env
```

The default backend URL is `http://localhost:8080` through `VITE_API_BASE_URL`.

Start the development server:

```bash
npm run dev
```

The app is available at `http://localhost:5173`.

## Routes

- `/`: public landing page
- `/auth/login`: login page connected to `POST /auth/login`
- `/auth/register`: registration page connected to `POST /auth/register`

## Validation and production

```bash
npm run lint
npm run format
npm run typecheck
npm run build
npm run preview
```

The production output is written to `dist/`. Docker serves the SPA through Nginx:

```bash
docker build -t streamingplatform-frontend .
docker run --rm -p 3000:80 streamingplatform-frontend
```

See `AGENTS.md` for directory ownership, API, styling, routing, and quality rules.
