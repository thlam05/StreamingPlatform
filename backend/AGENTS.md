# AGENTS.md

Java 21 + Spring Boot 4.1.1 backend for a livestreaming platform (StreamingPlatform).
Database: PostgreSQL
API: RESTful

## Commands

Run these from this folder:

```powershell
.\mvnw.cmd spring-boot:run   # dev server, port defaults to 8080 (server.port in application.properties)
.\mvnw.cmd test              # unit + integration tests
.\mvnw.cmd clean verify      # full build: compile, test, package
```

## Project architecture

Modular monolith organized by business domain. Each domain module follows the same internal layout:

```
src/main/java/com/thlam/streaming/
├── auth/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── mapper/
│   └── dto/
│       ├── request/
│       └── response/
├── common/
├── StreamingApplication.java
src/main/resources/
├── application.properties
└── db/migration/
src/test/java/com/thlam/streaming/
```

### Adding a new module

1. Create a new top-level package directly under `com.thlam.streaming` (e.g. `stream/`, `chat/`) — don't nest a new module inside an existing one.
2. Give it the sub-package layout above, only creating what's needed (skip `mapper/` or a module-local `exception/` if the module doesn't need one).
3. Never import one module's `entity`/`repository` classes directly from another module's `controller` or `service` — go through that module's `service` interface instead.
4. Code needed by two or more modules moves to `common/` — don't copy-paste it, and don't leave it duplicated "for now."

`common/` holds only genuinely shared code: base entity classes, the API response wrapper, global exception-handling infrastructure, security config, generic utilities. No module-specific logic there.

## Gotchas

### Database & JPA

- Database connection (host, port, user, database name) must be read from environment variables or profile-specific config — never hardcoded.
- `ddl-auto` stays `validate` — Hibernate must never auto-generate or alter the schema; all schema changes go through Flyway.
- Every schema change needs a new migration file (`V<n>__describe_change.sql`) in `src/main/resources/db/migration`. Never edit a migration that may already have been applied.
- Entity definitions must match their migrations exactly: column names, types, nullability, and `created_at`/`updated_at` timestamps.
- Preserve the existing UUID, timestamp, and naming conventions already used in the schema.
- Seed data must reference real, existing rows (correct foreign keys) — no orphaned references.
- Pagination responses must clearly separate total record count from total page count — don't conflate the two.
- Avoid N+1 queries: use `@EntityGraph`, `JOIN FETCH`, or explicit fetch joins when loading entities with relations, instead of triggering a query per related row.

### Spring conventions

- Lombok is enabled for boilerplate reduction. Use `@Getter` and `@Setter` for mutable DTOs where appropriate, and use `@RequiredArgsConstructor` for classes whose dependencies are `final`.
- Use Lombok constructor annotations such as `@NoArgsConstructor` and `@AllArgsConstructor` when their generated visibility and parameters are correct. Keep explicit constructors when they enforce domain invariants or special JPA visibility requirements.
- Records already provide their accessors and constructors; do not add Lombok annotations to record-based DTOs.
- Do not use `@Data` on JPA entities or security-sensitive classes. Avoid generated setters when they would bypass domain methods or expose protected fields.
- Constructor injection only (`private final XService service;` + constructor, usually generated with `@RequiredArgsConstructor`) — never field injection with `@Autowired` on a field.
- Read config via `@ConfigurationProperties` or `@Value`, never `System.getenv()` / hardcoded values in business code.
- Apply request validation with `@Valid` + Bean Validation annotations (`@NotNull`, `@Size`, etc.) on request DTOs — don't hand-roll validation checks in the controller.
- Controllers are declared inside their own module's `controller/` package, not registered ad hoc elsewhere.
- Throw a typed exception (e.g. a custom `ResourceNotFoundException`) for error handling — never let a raw unchecked exception reach the client unhandled. Let a `@RestControllerAdvice` in `common/` translate exceptions into the standard error response.

### RESTful & HTTP

- Resource creation is `POST /resource-name` — never `POST /resource-name/create`.
- Use correct status codes: `201 Created` on create, `400 Bad Request` for validation errors, `401 Unauthorized` for missing/invalid/expired auth, `403 Forbidden` for authenticated-but-not-permitted, `404 Not Found` for missing resources, `204 No Content` for successful deletes.
- A create response must return the created resource, including its generated id.
- An empty list result still returns `200 OK` with an empty array — not a 404.
- Path variables like `{id}` should be typed (`UUID`, `Long`) so Spring rejects malformed values before they reach the service layer.
- Login with wrong email/password returns `400 Bad Request`; reserve `401 Unauthorized` strictly for protected endpoints with a missing, invalid, or expired token.

### MVC structure

- Controllers only call services — no direct repository access or business logic in controllers.
- Entities live in their own `entity/` package, separate from DTOs.
- Request and response DTOs are separate classes; request DTOs carry Bean Validation annotations.
- Responses are shaped by a DTO/response class via a `mapper/` — never return a raw JPA entity directly from a controller.

### Logic & security

- Passwords are hashed with `BCryptPasswordEncoder`; password fields are never included in any response DTO.
- JWT expiry comes from config and must be validated as a real duration — guard against missing or malformed values.
- File paths (e.g. avatar/media uploads) must not get a double prefix (e.g. `/uploads/uploads/...`).
- File-deletion utilities must correctly handle paths that already start with a leading slash, to avoid malformed paths.
- Login error messages must not leak whether the email exists (avoid user enumeration) — use the same generic error for "no such user" and "wrong password".

### Naming

- Classes, entities, DTOs: `PascalCase`.
- Fields, variables, methods: `camelCase`.
- Filenames match their class name exactly (Java requires this for public classes).
- Packages: all lowercase, no underscores/hyphens.
- No typos in names — they get copy-pasted into imports and are hard to fix later.

### Format & tooling

- Run `.\mvnw.cmd test` after any behavior change; run `.\mvnw.cmd clean verify` for build, persistence, security, or application-wiring changes.
- No `System.out.println` in production code paths — use the configured logger (SLF4J).
- Keep import style consistent (no wildcard imports) and let the IDE/formatter enforce it.

### Code logic

- No dead code and no redundant/duplicate checks.
- Use enums or named constants instead of magic strings.
- Be consistent with async work (`@Async`, `CompletableFuture`) — never fire an async call without handling its result or exception, or explicitly and intentionally not awaiting it, with a comment explaining why.

## Rules for AI agents making changes

1. **Read before writing.** Open this guide and inspect the relevant module(s) before writing any code.
2. **Scope discipline.** Only touch what the task requires — no unrelated refactors, renames, or reformatting.
3. **Follow the module structure above** for any new class — right sub-package, not wherever is convenient.
4. **Schema changes go through Flyway** — new migration file, never edit an existing one.
5. **Test after changing** — `.\mvnw.cmd test` minimum, `.\mvnw.cmd clean verify` for anything touching build/persistence/security/wiring.
6. **No secrets in code** — environment variables or environment-specific config only.
7. **Keep this guide current** — if a change alters structure, commands, or required services, update the relevant section here in the same change.
