# AGENTS.md

## Project scope

These rules apply to the `frontend-client` project, a React + TypeScript + Vite frontend application.

The folder structure below is the target organization. Create folders and files when they are needed; do not create empty placeholder folders without a concrete use case.

## Project structure

```text
frontend-client/
├── .husky/
│   └── pre-commit
├── public/
├── src/
│   ├── assets/                     # Images, icons, and fonts only; no application code
│   │
│   ├── components/                 # Reusable UI across the whole app; no business logic
│   │   └── ui/
│   │       ├── Button/
│   │       ├── Input/
│   │       ├── Modal/
│   │       └── Spinner/
│   │
│   ├── config/
│   │   ├── env.ts                  # Read and validate import.meta.env variables
│   │   └── constants.ts            # App-wide constants; route paths belong in routes/paths.ts
│   │
│   ├── features/                   # Business logic organized by domain; no route pages
│   │   ├── auth/
│   │   │   ├── components/         # Auth-only components such as LoginForm and RegisterForm
│   │   │   ├── hooks/
│   │   │   ├── services/           # Auth-specific API calls
│   │   │   ├── stores/             # Auth-domain state when it is not global
│   │   │   └── types/
│   │   │
│   │   └── stream/                 # Stream and stream setup belong to one domain
│   │       ├── components/
│   │       │   ├── list/           # Components for StreamListPage
│   │       │   └── setup/          # Components for StreamSetupPage
│   │       ├── hooks/
│   │       ├── services/
│   │       └── types/
│   │
│   ├── hooks/                      # Hooks shared by multiple features
│   │
│   ├── layouts/                    # Layout wrappers with shared application chrome
│   │   ├── MainLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   └── DashboardLayout.tsx
│   │
│   ├── pages/                      # One page entry point per route; composition only
│   │   ├── HomePage/
│   │   │   └── HomePage.tsx
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── streams/
│   │   │   ├── StreamListPage.tsx
│   │   │   ├── StreamSetupPage.tsx
│   │   │   └── StreamDetailPage.tsx
│   │   ├── ForbiddenPage.tsx        # 403 page
│   │   └── NotFoundPage.tsx         # 404 page
│   │
│   ├── routes/                     # Routing only; no business logic or complex UI
│   │   ├── router.tsx              # The only place that declares the route tree
│   │   ├── paths.ts               # Centralized path constants
│   │   └── ProtectedRoute.tsx      # Auth and permission guard
│   │
│   ├── services/                   # Shared API infrastructure only
│   │   ├── apiClient.ts
│   │   └── interceptors.ts
│   │
│   ├── store/                      # Global state shared by multiple features
│   │   └── authStore.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── theme.css
│   │
│   ├── types/                      # Types shared across the whole app
│   │   ├── api.types.ts
│   │   └── common.types.ts
│   │
│   ├── utils/                      # Pure functions only; no API calls or hooks
│   │   ├── cn.ts
│   │   ├── formatDate.ts
│   │   └── error.ts
│   │
│   ├── App.tsx                     # Application root; should only mount RouterProvider
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── eslint.config.js
├── prettier.config.js
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
└── package.json
```

## Architecture rules

1. Organize business logic by domain under `src/features/`, not by technical type alone.
2. Keep route-specific page components under `src/pages/`. A page should compose feature components and layouts; do not put substantial business logic, API calls, or reusable UI in a page.
3. Put UI used across the entire application in `src/components/`. Put UI used by only one domain in that feature's `components/` folder.
4. Keep `src/layouts/` focused on shared structure such as headers, sidebars, footers, and `Outlet`. Layouts must not own feature-specific business logic.
5. Keep `src/routes/` focused on route configuration and guards. Do not put complex UI or domain services there.
6. Put shared API infrastructure in `src/services/`; domain-specific API calls belong in the relevant feature's `services/` folder.
7. Put state shared by multiple features in `src/store/`. Keep state used by only one domain in that feature's `stores/` folder.
8. Put reusable hooks in `src/hooks/`. Keep feature-specific hooks inside the relevant feature.
9. Put app-wide types in `src/types/`; keep domain types inside the relevant feature's `types/` folder.
10. Functions in `src/utils/` must be pure and must not call APIs, access router state, or use React hooks.
11. Keep `src/assets/` limited to static assets. Do not place components, services, or other application code there.
12. Read and validate environment variables through `src/config/env.ts`. Do not access `import.meta.env` throughout the application.
13. Keep app-wide constants in `src/config/constants.ts`. Route paths must be defined in `src/routes/paths.ts`.
14. Keep the `auth` domain responsible for authentication concerns. Reuse the global auth state from `src/store/authStore.ts` where both routing and layouts need it.
15. Keep stream listing, stream setup, and stream detail code under the single `src/features/stream/` domain to avoid duplicated services and types.

## React Router rules

1. Follow the React Router version declared in `package.json`. Do not mix APIs from different versions.
2. Declare the route tree in one place: `src/routes/router.tsx`. Do not define competing top-level routers elsewhere.
3. Mount the configured router from `src/App.tsx`; keep `App.tsx` free of page-level business logic.
4. Use `Link` or `NavLink` for in-app navigation. Use `<a>` only for external URLs or intentional full page reloads.
5. Use programmatic navigation (`useNavigate` or the equivalent API) only after an explicit action such as form submission, login, logout, or completion of an operation.
6. Prefer nested routes for shared layouts. Parent layouts must render child routes through `Outlet` or the equivalent API.
7. Define all route paths in `src/routes/paths.ts`. Do not hardcode route strings such as `/streams/...` in components.
8. Use consistent, readable paths and prefer nouns for resources, such as `/movies`, `/movies/:movieId`, and `/profile`.
9. Use route params for resource identifiers. Validate params and handle invalid or missing resources appropriately.
10. Protect routes requiring authentication or permissions with `src/routes/ProtectedRoute.tsx` or an equivalent explicit guard. Hiding a link is not sufficient protection.
11. Provide appropriate loading, error, forbidden, and not-found states. Routing errors must not leave the entire application blank.
12. Never put sensitive data in URLs, query strings, or route params. Use query strings only for shareable filters, sorting, pagination, and similar view state.
13. Keep page components independent from route configuration details where practical. Use the router's supported loaders, actions, context, or feature services according to the installed version.
14. When changing a route, update related links and verify direct URL access, internal navigation, refresh behavior, unknown routes, permission handling, and Back/Forward navigation.

## Change guidelines

- Do not add a React Router dependency unless the task explicitly requires it.
- Before creating a file or route, inspect existing code to avoid duplicate paths, services, types, or responsibilities.
- Prefer small, backward-compatible changes that follow the structure above.
- Update this file when the project adopts an additional architecture or routing convention.
