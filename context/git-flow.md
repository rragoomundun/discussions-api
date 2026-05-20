# Git Flow Branching Strategy

This project uses Git Flow. ALWAYS follow these conventions:

## Branch Types

- `main` — production-only, never commit directly
- `develop` — integration branch, base for features
- `feature/` — new features (branch from develop)
- `release/` — release prep (branch from develop)
- `hotfix/` — urgent production fixes (branch from main)

## Rules

- New features: `git flow feature start <name>`
- Finish features: `git flow feature finish <name>` (merges to develop)
- New releases: `git flow release start <version>`
- Finish releases: `git flow release finish <version>`
- New hotfixes: `git flow hotfix start <name>`
- Finish hotfixes: `git flow hotfix finish <name>`
- NEVER push directly to main or develop
