# Current Feature: Format Birthday in getUser

## Status

In Progress

## Goals

- In `getUser`, return `birthday` formatted as `YYYY-MM-DD` instead of a raw date

## Notes

- `birthday` may be `null` — handle gracefully
- Update the apidoc `@apiSuccess` annotation to reflect the new format

## History

<!-- Keep this updated. Earliest to latest -->
- **20-05-26 — Claude Code Initialization** — Added `.claude/` skills folder and `CLAUDE.md` project configuration file.
- **20-05-26 — Claude Code Configuration 2** — Added `/hotfix` skill, updated feature skill for git flow, added apidoc section to coding standards, fixed model indentation.
- **26-05-29 — Upload Middleware Filename** — Upload filenames now use `Date.now()` + mime-derived extension instead of the original filename.
