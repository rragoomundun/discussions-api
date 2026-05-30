# Current Feature: Create Discussion

## Status

In Progress

## Goals

- Create the `Discussion` Sequelize model with fields: `id` (integer, PK), `title` (string), `open` (boolean), `createdAt` (date), `forumId` (FK)
- Create the corresponding database migration
- Create `POST /discussion` endpoint to create a new discussion

## Notes

- Include `userId` (FK → User) on the model and migration — confirmed by user
- `open` should default to `true` for a newly created discussion
- Follow existing model, controller, route, and migration patterns

## History

<!-- Keep this updated. Earliest to latest -->
- **20-05-26 — Claude Code Initialization** — Added `.claude/` skills folder and `CLAUDE.md` project configuration file.
- **20-05-26 — Claude Code Configuration 2** — Added `/hotfix` skill, updated feature skill for git flow, added apidoc section to coding standards, fixed model indentation.
- **26-05-29 — Upload Middleware Filename** — Upload filenames now use `Date.now()` + mime-derived extension instead of the original filename.
- **26-05-30 — Format Birthday in getUser** — `birthday` in `getUser` now returns as `YYYY-MM-DD` string instead of a raw date.
- **26-05-30 — Get Forum in Category** — Added `GET /category/:categoryId/forum` endpoint returning a category with its nested forums.
