# Current Task: Warning Author

Get the warning author.

## Status

Complete

## Goals

- In `GET /warning/all` (`getWarnings`), return the moderator who gave each warning as a `moderator` field: `{ id, name }`
- Update the endpoint documentation and regenerate it

## Notes

- Spec: `context/fixes/5-warning-author-spec.md`
- The `Warning` → `User` association with alias `moderator` (via `moderatorId`) already exists in `models/setupDBAssociations.js`
- `moderatorId` stays nullable (`ON DELETE SET NULL`), so `moderator` is `null` when there is no moderator
