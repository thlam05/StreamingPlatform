# AGENTS.md

## Scope and rule precedence

This file contains repository-wide instructions for `StreamingPlatform`.

When working on a file or directory, follow every applicable `AGENTS.md` from the repository root down to the target path. A more specific `AGENTS.md` in a child directory takes precedence over this file when the instructions conflict; otherwise, the broader rules continue to apply.

Examples:

- Changes under `frontend-client/` must follow both this file and [`frontend-client/AGENTS.md`](frontend-client/AGENTS.md). The frontend guide is the authority for React, TypeScript, Vite, feature structure, routing, and frontend verification.
- Changes under `backend/` must follow both this file and [`backend/AGENTS.md`](backend/AGENTS.md). The backend guide is the authority for Java, Spring Boot, persistence, API conventions, and backend verification.
- If a deeper directory contains another `AGENTS.md`, apply it in addition to the guides above, with the deepest applicable file taking precedence for that directory.

Before making changes, read the root guide and the nearest applicable child guide. Keep changes within the requested scope, preserve existing user work, and run the verification required by the most specific applicable guide.
