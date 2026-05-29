# Current Feature: Upload Middleware Filename

## Status

In Progress

## Goals

- In the upload middleware, replace the filename with `Date.now()` + the file extension only (drop the original filename)

## Notes

- Current filename: `${Date.now()}-${file.originalname}`
- Target filename: `${Date.now()}${ext}` where `ext` is the extension extracted from `file.originalname`
- Use `path.extname()` to extract the extension

## History

<!-- Keep this updated. Earliest to latest -->
- **20-05-26 — Claude Code Initialization** — Added `.claude/` skills folder and `CLAUDE.md` project configuration file.
- **20-05-26 — Claude Code Configuration 2** — Added `/hotfix` skill, updated feature skill for git flow, added apidoc section to coding standards, fixed model indentation.
