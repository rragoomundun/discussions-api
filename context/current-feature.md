# Current Feature: Get Forum in Category

## Status

In Progress

## Goals

- Create a `GET /category/:categoryId/forum` endpoint
- Return the category fields: `id`, `name`, `description`, `metaDescription`
- Include a `forums` array with each forum's: `id`, `name`, `description`, `metaDescription`, `index`

## Notes

- Forums should be scoped to the given category (`categoryId`)
- Follow existing route/controller/model patterns in the codebase

## History

<!-- Keep this updated. Earliest to latest -->
- **20-05-26 — Claude Code Initialization** — Added `.claude/` skills folder and `CLAUDE.md` project configuration file.
- **20-05-26 — Claude Code Configuration 2** — Added `/hotfix` skill, updated feature skill for git flow, added apidoc section to coding standards, fixed model indentation.
- **26-05-29 — Upload Middleware Filename** — Upload filenames now use `Date.now()` + mime-derived extension instead of the original filename.
- **26-05-30 — Format Birthday in getUser** — `birthday` in `getUser` now returns as `YYYY-MM-DD` string instead of a raw date.
