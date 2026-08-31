---
name: fix
description: Manage current fix workflow - start, review, explain or complete
argument-hint: load|start|review|explain|complete
---

# Fix Workflow

Manages the full lifecycle of a fix from spec to merge.

## Working File

@context/current-task.md

### File Structure

current-task.md has these sections:

- `# Current Task` - H1 heading with fix name when active
- `## Status` - Not Started | In Progress | Complete
- `## Goals` - Bullet points of what success looks like
- `## Notes` - Additional context, constraints, or details from spec

## Task

Execute the requested action: $ARGUMENTS

| Action     | Description                           |
| ---------- | ------------------------------------- |
| `load`     | Load a fix spec or inline description |
| `start`    | Begin implementation, create branch   |
| `review`   | Check goals met, code quality         |
| `explain`  | Document what changed and why         |
| `complete` | Commit, push, merge, reset            |

See [actions/](actions/) for detailed instructions.

If no action provided, explain the available options.
