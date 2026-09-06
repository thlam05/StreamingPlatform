---
name: frontend-page-architecture
description: Build pages with focused components, hooks, and feature modules.
---

# Frontend Page Architecture

Use this skill when creating a new frontend page, adding a route-level flow, or refactoring a page that has become difficult to maintain. The outcome is a working page whose responsibilities are split deliberately without creating unnecessary abstraction.

## Operating workflow

1. Inspect the repository's current structure, route conventions, design system, existing UI primitives, related features, API services, and hooks before writing code.
2. Define the page contract: route, user goal, inputs, outputs, API calls, URL state, local UI state, loading state, empty state, error state, and navigation outcomes.
3. Map each responsibility to one owner:
   - `pages/`: route-level composition and page orchestration.
   - `features/<feature>/`: domain behavior and feature-owned UI.
   - `components/ui/`: genuinely reusable, domain-neutral primitives.
   - `components/layout/` or `layouts/`: shared shells and navigation structure.
   - `hooks/`: reusable stateful behavior or lifecycle logic.
   - `services/`: API transport and feature service calls.
   - `utils/`: pure, stateless transformations.
   - `types/`: shared contracts and domain types.
4. Search for existing components, hooks, services, types, and styles before creating new ones. Extend an existing primitive when its responsibility still fits; do not duplicate near-identical implementations.
5. Implement in small boundaries: data/service contract first, stateful hook next when needed, focused components next, then a thin page that composes them.
6. Validate the complete user flow, including navigation, keyboard use, responsive layout, loading, empty, error, disabled, and long-content states.

## Responsibility rules

- A page should answer "which pieces appear here and how are they composed?", not contain every field, API call, formatting rule, and interaction handler.
- A component should have one coherent visual or interaction responsibility. Split a component when it owns unrelated UI sections, mixes data fetching with presentation, or requires a long chain of conditional branches to render.
- A hook should own reusable stateful behavior, not be created merely to hide a few lines of JSX. Keep one hook focused on one behavior such as filtering, pagination, form state, or synchronization.
- A service should own request construction, response typing, and transport errors. Components and hooks should call services rather than construct URLs or Axios clients.
- A utility should be pure and reusable without React. Do not put feature state, navigation, or network calls in `utils/`.
- Keep route components thin and colocate feature-specific code under its feature. Promote code to shared folders only after a second real consumer exists.
- Prefer explicit, typed props and narrow interfaces. Avoid "god" props objects, catch-all `BaseComponent` abstractions, and prop drilling through unrelated layers.
- Keep local state at the lowest component that needs it. Lift it only when multiple siblings need the same source of truth; use global state only for cross-route state.

## Duplication and abstraction guardrails

- Before adding code, search by behavior and UI shape, not only by filename. Look for existing buttons, inputs, cards, dialogs, formatters, query hooks, and API methods.
- Extract shared code when the behavior, accessibility contract, and styling are stable across consumers. Do not abstract two components that only look similar but have different domain meaning.
- Keep feature variations as explicit props or small variants. Do not create a configuration-driven mega-component to avoid a few repeated lines.
- Keep constants and types close to their owner until they are truly shared.
- Never copy API error parsing, loading state conventions, or form validation logic across pages; centralize those behaviors at the appropriate service, hook, or utility boundary.

## File-size and complexity signals

Do not enforce an arbitrary line limit, but stop and reassess when a file:

- owns more than one unrelated user workflow;
- mixes route setup, API calls, form state, rendering, and formatting;
- has multiple repeated JSX blocks or repeated state transitions;
- needs many boolean props to describe different modes; or
- cannot be explained with one clear sentence describing its responsibility.

When one of these signals appears, split by responsibility and keep the public interface small. Do not split every tiny markup fragment into a component.

## Project conventions

For this Vite client:

- Use the `@/*` alias for `src/*` imports.
- Keep route pages under `src/pages/` and route definitions under `src/routes/`.
- Keep feature modules under `src/features/<feature-name>/`.
- Reuse `src/components/ui/` primitives and semantic Tailwind tokens from `src/index.css`.
- Read environment variables only through `src/config/`.
- Call the backend only through `src/services/apiClient.ts` and feature services.
- Follow the existing ESLint, Prettier, TypeScript, and import conventions.

If a repository uses a different structure, preserve its established conventions and apply the same ownership principles rather than forcing this layout onto it.

## Completion checklist

Before finishing a page:

- The route and page responsibility are clear.
- Existing primitives and feature code were reused where appropriate.
- API calls, validation, and reusable stateful behavior are outside the page render when they are not page-specific.
- No duplicated API client, error parser, formatter, or form behavior was introduced.
- The page handles loading, empty, error, disabled, and success states that apply to its flow.
- Keyboard navigation, labels, focus states, responsive behavior, and semantic HTML are covered.
- `lint`, `format`, `typecheck`, build, and relevant tests pass.
