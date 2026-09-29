# Current Task: Warning Table

Create the Warning table, which records warnings given to users by moderators.

## Status

Complete

## Goals

- Create a migration for the `Warning` table with the fields:
  - `id` (INTEGER, primary key)
  - `message` (TEXT)
  - `date` (DATE, defaults to `NOW()`)
  - `userId` (INTEGER, foreign key to `User`)
  - `moderatorId` (INTEGER, foreign key to `User`)
- Create the `Warning` model in `models/Warning.js`
- Register the Warning ↔ User associations in `models/setupDBAssociations.js`

## Notes

- Spec: `context/features/12-warning-table-spec.md`
- Follow the existing `create-message-table` migration and `Message` model, which also reference `User` twice (`authorId`, `editorId`)
