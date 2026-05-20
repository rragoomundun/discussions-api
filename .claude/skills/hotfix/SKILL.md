---
name: hotfix
description: Create or manage a hotfix branch
argument-hint: branch
---

# Hotfix Workflow

Manages the full lifecycle of a hotfix from creation to merge.

## Working File

@context/current-hotfix.md

### File Structure

current-hotfix.md has these sections:

- `# Current Hotfix` - H1 heading with hotfix name when active
- `## Status` - Not Started | In Progress | Complete
- `## Goals` - Bullet points of what success looks like
- `## Notes` - Additional context, constraints, or details from spec
- `## History` - Completed hotfixes (append only)

## Task

Execute the requested action: $ARGUMENTS

| Action     | Description                              |
| ---------- | ---------------------------------------- |
| `load`     | Load a hotfix spec or inline description |
| `start`    | Begin implementation, create branch      |
| `review`   | Check goals met, code quality            |
| `explain`  | Document what changed and why            |
| `complete` | Commit, push, merge, reset               |

See [actions/](actions/) for detailed instructions.

If no action provided, explain the available options.
