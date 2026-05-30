# Current Feature: Update Discussion

## Status

In Progress

## Goals

- Create `PUT /discussion/:discussionId` endpoint to update a discussion
- Update the `title` field
- Set `updatedAt` to the current date on update

## Notes

- Only the discussion owner, any moderator, or the admin may update a discussion — return 403 otherwise
- Return 404 if the discussion does not exist

## History

<!-- Keep this updated. Earliest to latest -->
- **20-05-26 — Claude Code Initialization** — Added `.claude/` skills folder and `CLAUDE.md` project configuration file.
- **20-05-26 — Claude Code Configuration 2** — Added `/hotfix` skill, updated feature skill for git flow, added apidoc section to coding standards, fixed model indentation.
- **26-05-29 — Upload Middleware Filename** — Upload filenames now use `Date.now()` + mime-derived extension instead of the original filename.
- **26-05-30 — Format Birthday in getUser** — `birthday` in `getUser` now returns as `YYYY-MM-DD` string instead of a raw date.
- **26-05-30 — Get Forum in Category** — Added `GET /category/:categoryId/forum` endpoint returning a category with its nested forums.
- **26-05-30 — Create Discussion** — Added `Discussion` model, migration, and `POST /discussion` endpoint with auth and validation.
