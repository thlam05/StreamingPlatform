# Streaming Platform frontend

React + TypeScript + Vite frontend for the Streaming Platform application.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- The backend API running at the URL configured in `.env`

## Installation

Install dependencies from the frontend project directory:

```bash
npm install
```

For a clean install in CI or when `package-lock.json` must be used exactly:

```bash
npm ci
```

Create a local environment file from the example and update the API URL if needed:

```bash
copy .env.example .env
```

PowerShell alternative:

```powershell
Copy-Item .env.example .env
```

The default configuration is:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## Development

Start the Vite development server with hot reload:

```bash
npm run dev
```

The terminal will show the local URL, normally `http://localhost:5173`.

Start the server and make it available on the local network:

```bash
npm run dev -- --host
```

## Verification and production build

Run TypeScript verification and create the production bundle:

```bash
npm run build
```

Run TypeScript verification without creating the production bundle:

```bash
npm run typecheck
```

Preview the production bundle locally after building:

```bash
npm run preview
```

Run ESLint across the project:

```bash
npm run lint
```

Check formatting without changing files:

```bash
npm run format:check
```

Format project files with Prettier:

```bash
npm run format
```

`npm run format` formats the whole repository. Run it once if `format:check` reports existing style differences.

Run the usual checks before committing:

```bash
npm run format:check
npm run lint
npm run build
```

## Useful direct commands

Run Vite directly:

```bash
npx vite
npx vite build
npx vite preview
```

Run TypeScript without creating output files:

```bash
npx tsc -b --noEmit
```

Check or format a specific file:

```bash
npx prettier --check src/features/stream/components/setup/StreamSetup.tsx
npx prettier --write src/features/stream/components/setup/StreamSetup.tsx
```

Lint a specific file:

```bash
npx eslint src/features/stream/components/setup/StreamSetup.tsx
```

## Project structure

```text
src/
├── components/       # Reusable application UI and layout components
├── config/           # Environment and application configuration
├── features/         # Domain-specific auth and stream code
├── layouts/          # Shared page shells
├── pages/            # Route-level page composition
├── routes/           # Router and route guards
├── services/         # Shared API client infrastructure
├── store/            # Global state
├── styles/           # Global styles and theme tokens
├── types/            # Application-wide types
└── utils/            # Pure utility functions
```

Stream setup uses a three-step flow:

1. Create credentials
2. Upload thumbnail
3. Preview the stream and start broadcasting

Each setup step owns the hooks required by that step. The parent setup component only owns shared state such as the current phase and stream data.

## Notes

- Use the shared Axios instance in `src/services/apiClient.ts` for API requests.
- Do not call `import.meta.env` directly outside `src/config/env.ts`.
- Use centralized route paths from `src/routes/paths.ts`.
- Keep stream-specific business logic under `src/features/stream/`.
