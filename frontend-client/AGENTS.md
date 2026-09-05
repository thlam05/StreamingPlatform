# Frontend implementation guide

## Project purpose

This directory contains the StreamingPlatform client. Use the SterioX client as the reference implementation for project structure, styling, routing, API integration, and frontend quality checks.

The application is a Vite-powered React SPA using:

- React 19 and TypeScript in strict mode.
- React Router browser routing with `createBrowserRouter`.
- Vite and `@vitejs/plugin-react` for development and production builds.
- Tailwind CSS v4 with semantic design tokens in `src/index.css`.
- Axios through the shared client in `src/services/apiClient.ts`.
- ESLint, Prettier, Husky, and lint-staged.

Do not reintroduce React Router Framework Mode, server-rendered `app/` routes, `react-router.config.ts`, or generated `.react-router/` files unless the architecture is intentionally redesigned and this document is updated in the same change.

## Authoritative directory structure

```text
frontend-client/
├── .husky/
│   └── pre-commit                 # Staged-file quality checks
├── public/                        # Public static files and icons
├── src/
│   ├── assets/                    # Imported images, fonts, and asset modules
│   ├── components/
│   │   ├── ui/                    # Reusable primitives (Button, Input, Modal)
│   │   ├── layout/                # Header, Sidebar, navigation components
│   │   └── features/              # Feature-owned presentation components
│   ├── config/                    # Typed environment access and app constants
│   ├── features/                  # Domain modules and feature-specific logic
│   ├── hooks/
│   │   ├── common/                # Shared hooks
│   │   └── features/              # Feature-specific hooks
│   ├── layouts/                   # Page shells containing Outlet/layout composition
│   ├── pages/                     # Route-level page components
│   ├── routes/                    # Router definition and centralized paths
│   ├── services/                  # Axios client and API service modules
│   ├── store/                     # Cross-feature client state, only when needed
│   ├── styles/                    # Extra global style modules when needed
│   ├── types/                     # Shared API and domain types
│   ├── utils/                     # Pure helpers and error/formatting utilities
│   ├── App.tsx                    # Root RouterProvider component
│   ├── index.css                  # Tailwind import and semantic theme tokens
│   └── main.tsx                   # Browser entrypoint
├── .env.example                   # Documented environment variables
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

Do not create a second source tree. Feature code belongs under `src/features/<feature-name>/`; cross-feature UI belongs under `src/components/`; route-level composition belongs under `src/pages/`.

## Architecture and ownership

- `src/main.tsx` mounts `App`; it must not contain feature logic.
- `src/App.tsx` owns the `RouterProvider` boundary.
- `src/routes/index.tsx` owns `createBrowserRouter`; `src/routes/paths.ts` is the source of truth for URLs.
- `src/pages/` contains thin route-level components. Pages compose layouts and features instead of owning API details.
- `src/layouts/` contains shared page shells and `Outlet` composition.
- `src/components/ui/` contains reusable, domain-neutral controls. Keep feature-specific UI out of this folder.
- `src/features/<feature>/` contains feature components, hooks, services, and types that are not broadly reusable.
- `src/services/` contains transport and cross-feature API modules. Feature services should call the shared Axios client.
- `src/config/` is the only place where `import.meta.env` should be read.
- `src/store/` is for state shared across unrelated routes. Keep transient form and view state local.
- `src/utils/` should remain pure and framework-independent where possible.
- Use the `@/*` alias for imports from `src/*`. Use relative imports only for files that are immediately adjacent.

## Routing

- Use `createBrowserRouter`, `RouterProvider`, `Link`, `NavLink`, `Navigate`, and `Outlet` from `react-router`.
- Register paths in `src/routes/paths.ts` before using them in components.
- Keep public auth paths under `/auth/*`; current auth routes are `/auth/login` and `/auth/register`.
- Add protected routes through an explicit route guard/layout once authentication state is available. Do not hide protected pages only with client-side styling.
- Add a route-level fallback for unknown paths and preserve accessible navigation states.

## Styling and design system

- `src/index.css` is the source of truth for the SterioX-inspired palette and semantic Tailwind tokens.
- Prefer classes such as `bg-primary`, `bg-primary-light`, `text-foreground`, `text-secondary`, `border-border`, `bg-success-light`, and `text-danger` over hard-coded hex values in components.
- Preserve light and dark token values. Add a new token only when the existing semantic palette cannot express the requirement.
- Reuse UI primitives from `src/components/ui/` before creating one-off controls.
- Use responsive layouts deliberately for mobile, tablet, and desktop. Include loading, empty, error, disabled, and long-content states.
- Use semantic HTML, visible focus states, keyboard-accessible controls, associated labels, useful alt text, and accessible names for icon-only controls.
- Use Lucide icons or existing project assets when an icon is needed; do not introduce ad-hoc SVG variants without a reason.

## API and authentication

- Use `src/services/apiClient.ts` for all Axios requests; do not construct Axios instances or backend URLs inside components.
- Read `VITE_API_BASE_URL` through `src/config/globalConfig.ts`. Local development defaults to `http://localhost:8080`.
- Backend auth endpoints are `POST /auth/login` and `POST /auth/register`.
- Keep request/response types in `src/types/` or the owning feature's `types.ts`. Validate untrusted response data before using it.
- Handle Axios errors through the shared error helper and show actionable messages to users.
- The access token is stored only by the auth/API layer and sent as a Bearer token by the shared client. Never log tokens or render them into the UI.
- Never expose private credentials in `VITE_*` variables; Vite exposes those values to the browser bundle.

## Environment variables

- Document client variables in `.env.example` and keep local values in the ignored `.env` file.
- `VITE_API_BASE_URL` is a public backend base URL, not a secret.
- Keep all environment access in `src/config/`; do not scatter `import.meta.env` through pages or components.

## Code quality and commands

Run commands from `frontend-client/`:

```bash
npm install
npm run dev
npm run lint
npm run lint:fix
npm run format
npm run format:fix
npm run typecheck
npm run build
npm run preview
```

Before handoff:

1. Run `npm run lint`.
2. Run `npm run format`.
3. Run `npm run typecheck`.
4. Run `npm run build` for route, configuration, dependency, or production-facing changes.
5. Manually verify affected flows at mobile and desktop widths, including keyboard navigation and API error states.

Keep `.husky/pre-commit` running lint-staged. Staged TypeScript/JavaScript files must pass ESLint and Prettier before commit. Do not silently ignore hook failures.

## Dependency discipline

- Prefer the existing Vite, React, React Router, Tailwind, Axios, and UI patterns from the SterioX reference.
- Add a dependency only when it materially reduces complexity or is required by a feature. Update `package-lock.json` with `package.json`.
- Keep commits focused and do not commit `dist/`, `build/`, `.react-router/`, real `.env` files, tokens, or debug output.
