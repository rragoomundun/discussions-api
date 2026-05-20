# Discussions API

Discussions API is the REST API for the Discussion project (a forum software).

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/git-flow.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

```bash
# Run the server (hot reload via --watch, auto-loads .env)
npm run start

# Generate API documentation from JSDoc comments in controllers
npm run gendoc
```

No test suite exists in this project.

### Database Migrations

Migrations live in `migrations/` and have their own `package.json`. Run from the repo root:

```bash
npm run migration:create -- --name migration-name   # scaffold new migration file
npm run migration:migrate                            # apply pending migrations
npm run migration:rollback                           # undo the last migration
```

Before first use, copy `migrations/config/config.example.json` to `migrations/config/config.json` and fill in DB credentials.

### Documentation

`npm run gendoc` reads JSDoc `@api*` annotations in `controllers/` and writes HTML to `public/`.
