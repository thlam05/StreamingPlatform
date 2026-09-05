# Frontend implementation guide

## Project overview

This directory contains the StreamingPlatform frontend. It is a React 19 application using:

- React Router v8 with server-side rendering enabled (Framework Mode).
- TypeScript in strict mode.
- Vite for development and builds.
- Tailwind CSS v4 through `@tailwindcss/vite`.
- The `~/*` TypeScript alias for imports from `app/*`.

Keep frontend changes inside this project unless the task explicitly requires a backend or infrastructure change.

## Directory structure

This project uses React Router's `app/` file convention (Framework Mode), **not** the generic `src/` SPA layout. Treat the table below as authoritative — it maps the ownership rules to the folders that actually exist in this repo, so there is one structure to follow, not two.

```text
{project-name}/
├── .husky/
│   └── pre-commit
├── public/                     # Files served as-is at a stable URL
├── app/
│   ├── root.tsx                # App shell, document metadata, global Links, Outlet, ErrorBoundary
│   ├── routes.ts                # Route configuration (React Router route helpers)
│   ├── routes/                  # Route modules: loaders, actions, route-specific UI
│   ├── features/                 # Feature modules, grouped by domain
│   │   └── <feature-name>/
│   │       ├── components/       # Feature-owned UI
│   │       ├── hooks/            # Feature-owned hooks
│   │       ├── services/         # Feature-owned API calls
│   │       └── types/            # Feature-owned types
│   ├── components/               # Cross-feature reusable UI (Button, Modal, Input, Table)
│   ├── hooks/                     # Shared custom hooks (useDebounce, useLocalStorage)
│   ├── layouts/                    # Page shells and layout wrappers
│   ├── services/                    # Shared API client, fetch helpers, interceptors
│   ├── store/                        # Global client state (e.g. Zustand stores)
│   ├── types/                         # Shared TypeScript and API types
│   ├── utils/                          # Pure shared helpers (formatting, errors, `cn`)
│   ├── config/                          # Typed environment access and app constants
│   ├── styles/ (or app.css directly)      # Global CSS, Tailwind directives, theme tokens
│   └── app.css
├── .gitignore
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
├── vite.config.ts
├── react-router.config.ts
└── package.json
```

Notes on the scaffold:

- `app/welcome/` is starter/template content; replace or remove it when implementing product UI.
- Until an explicit migration is requested, do not introduce a parallel `src/` tree alongside `app/`. If a task genuinely requires switching to SPA mode, migrate the structure completely (routes, config, and this document) in the same change rather than letting both conventions coexist.

Directory ownership rules (apply within `app/`, as mapped above):

- Put feature-specific code under `app/features/<feature-name>/`, grouped by domain rather than by file type. A feature may contain its own components, hooks, services, and types.
- Put a component in `app/components/` only when it is genuinely reusable across features. Do not place feature-specific UI there.
- Keep `app/routes/` focused on route definitions, loaders/actions, guards, and navigation concerns; route modules should compose feature components rather than contain business logic themselves.
- Keep `app/services/` focused on transport and API integration for cross-feature use. Feature-specific API calls live in the feature's own `services/` folder instead.
- Use `app/config/` for typed environment access and application constants. Never commit secrets or expose private credentials to the browser (see "Environment variables" below).
- Use `app/store/` only for state needed across unrelated routes/features. Keep local UI state local to the component or feature.
- Keep shared helpers in `app/utils/` pure and framework-independent whenever possible.
- Use `app/assets/` (if present) for imported assets and `public/` for files that must be served by a stable public URL.

## Implementation conventions

1. Use TypeScript and keep `strict` type checking clean. Do not use `any` to bypass a type problem; define a type, narrow the value, or handle the error explicitly.
2. Prefer route modules for page-level data loading and mutations. Use React Router loaders/actions and generated route types where appropriate instead of fetching everything in `useEffect`.
3. Keep reusable presentation and interaction components close to the feature that owns them. Create shared components only when they are genuinely reused.
4. Use the `~/*` alias for imports that cross feature boundaries; use relative imports for nearby files when that is clearer.
5. Keep server-only code out of browser components. Treat secrets, tokens, database access, and private API credentials as server-only values; never expose them in client bundles.
6. Use semantic HTML, keyboard-accessible controls, visible focus states, labels for form fields, useful alt text, and accessible names for icon-only buttons.
7. Design responsive states deliberately for mobile, tablet, and desktop. Handle loading, empty, error, disabled, and long-content states rather than styling only the happy path.
8. Reuse Tailwind utilities and the theme in `app/app.css`. Avoid adding a new styling library or global CSS pattern without a clear reason.
9. Use stable keys for lists, avoid unnecessary effects, and keep rendering pure. Memoization should solve a measured problem, not be added by default.
10. Preserve existing behavior outside the requested scope. Do not rewrite generated files under `.react-router/` or commit build output.

## Routing and SSR

- Register every new route in `app/routes.ts` and add its route module under `app/routes/`.
- Route `meta` functions should provide an accurate page title and description.
- Assume route code can participate in SSR. Do not read browser-only globals such as `window`, `document`, or `localStorage` during server rendering; guard browser-only work or move it to an appropriate client-side lifecycle (e.g. `useEffect`, or a `clientLoader`/`clientAction` where the route needs browser-only data).
- Use `Link`/`NavLink` for internal navigation instead of raw anchors when navigation should stay inside the app.
- Add pending and error UI for navigations or mutations that can take noticeable time.
- Keep the root `ErrorBoundary` useful, and add route-specific error handling only when the route can provide better recovery guidance.

## Styling and assets

- Prefer Tailwind classes for component styles and keep repeated values consistent with the design system.
- Put global resets, fonts, theme tokens, and truly global rules in `app/app.css`.
- Treat the color tokens in `app/app.css` as the source of truth, based on the SterioX palette. Prefer semantic classes such as `bg-primary`, `text-foreground`, `border-border`, `bg-success-light`, and `text-danger` over hard-coded hex values in components.
- Preserve both light and dark palette values. Add a new color token only when the existing semantic palette cannot express the requirement, and document the reason in `app/app.css`.
- Put static images, favicons, and other immutable public files in `public/`; import component-owned assets when bundling them is preferable.
- Optimize large media assets and provide responsive sizing.
- Before adding a remote font, image host, or third-party script, confirm it's from an intentional, production-appropriate source (not a placeholder/demo URL) and check its licensing and performance cost (e.g. self-host fonts where practical instead of a render-blocking remote request).

## API and state

- Centralize API request details and response types instead of duplicating URLs and parsing logic across components.
- Use `app/services/api-client.ts` as the shared Axios instance. Feature services should import `apiClient`; do not call Axios or construct backend URLs directly inside components.
- Read the backend base URL from `VITE_API_BASE_URL` through `app/config/env.ts`. The local development default is `http://localhost:8080`.
- Handle Axios failures explicitly, validate untrusted response data, and surface actionable errors to users.
- Keep server state in route data when possible. Use local component state for transient UI state such as dialogs, filters, and form controls.
- Do not put sensitive data in URL parameters, browser storage, logs, or rendered HTML.
- Follow the backend contract that exists in the workspace; if a contract is unclear, document the assumption in the change rather than silently inventing incompatible fields.

## Environment variables

- Vite only exposes variables prefixed with `VITE_` to client-side code; anything without that prefix stays server-only and is unavailable in the browser bundle. Choose the prefix deliberately — don't add `VITE_` to a value just to make it "work" if that value shouldn't reach the browser.
- Access environment variables only through `app/config/` (typed accessors), not `import.meta.env` scattered across components, so a missing or misnamed variable fails in one place with a clear error.
- Document required environment variables (name, purpose, client vs. server) in a `.env.example` file; never commit a real `.env`.

## Testing

- Use Vitest with React Testing Library for component and hook tests; colocate test files next to the code they cover (e.g. `DescriptionEditor.test.tsx` beside `DescriptionEditor.tsx`).
- Test behavior (what the user sees and can do) rather than implementation details; avoid asserting on internal state or component structure.
- Add a `test` script (and `test:watch` if useful) to `package.json`, and run it in `.husky/pre-commit` or CI once introduced. Do not let a missing test suite block small, low-risk changes, but add coverage for new business logic (validators, formatters, non-trivial hooks) as it's introduced.

## Commands and validation

Run commands from this directory:

```bash
npm install       # only when dependencies or the lockfile require it
npm run dev       # local development with HMR
npm run lint      # ESLint validation
npm run lint:fix  # ESLint autofix for safe fixes
npm run format    # Prettier check
npm run format:fix # Prettier autofix
npm run typecheck # generate React Router types and run TypeScript
npm run build     # production build
npm run start     # serve the production build
npm run test      # run the test suite, once introduced
```

## ESLint and Prettier

- Use ESLint for code-quality and correctness checks, and Prettier for consistent formatting. Both are required for frontend code.
- Keep the ESLint configuration in `eslint.config.js` and the Prettier configuration in `.prettierrc`. Do not add competing formatter or linter configurations.
- Configure ESLint for TypeScript, React, React Hooks, React Router, and accessibility rules where supported by the installed packages.
- Do not disable a lint rule inline unless the exception is necessary, narrowly scoped, and documented beside the disable comment.
- Add a `.prettierignore` when generated output, build artifacts, or vendored files need to be excluded.
- Configure `.husky/pre-commit` to run staged-file checks (ESLint, Prettier, and — once introduced — affected tests) before a commit is created. Do not make the hook silently ignore failures.

Before handing off a change:

1. Run `npm run lint` and `npm run format`.
2. Run `npm run typecheck`.
3. Run `npm run test` if a test suite exists.
4. Run `npm run build` for route, configuration, dependency, or production-facing changes.
5. Manually verify the affected flow at mobile and desktop widths, including keyboard navigation and error/empty states.
6. Review the diff for accidental generated files, secrets, debug output, or unrelated formatting changes.

If ESLint, Prettier, or pre-commit tooling is not yet installed, add the required dev dependencies and scripts as part of the setup change.

## Dependency and change discipline

- Prefer the existing React Router, React, TypeScript, Vite, and Tailwind stack.
- Add a dependency only when it materially reduces complexity or provides required functionality. Update `package-lock.json` together with `package.json`.
- Do not change SSR mode, build configuration, Docker behavior, or environment-variable conventions without explaining the impact.
- Keep commits and patches focused; avoid replacing the starter architecture wholesale unless the task calls for it.
