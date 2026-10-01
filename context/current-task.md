# Current Task: Warning Roles

Limit who can get a warning.

## Status

Complete

## Goals

- In the `createWarning` controller, only allow warnings to be given to a regular user
- A warning cannot be given to a moderator or the administrator (whoever gives it)

## Notes

- Spec: `context/fixes/4-warning-roles-spec.md`
- Currently only moderators are prevented from warning moderators/admin; the admin can still warn a moderator
