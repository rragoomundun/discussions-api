# Current Task: Messages Users Active Field

Return the `active` field for all users in the `getMessagesInDiscussion` and `getMessage` controllers.

## Status

Complete

## Goals

- In `getMessagesInDiscussion` (`GET /message/all`), return `active` for every user in each message:
  - `author.active`
  - `editor.active` (when the message has an editor)
- Do the same in `getMessage` (`GET /message/:messageId`)
- Update the endpoints documentation and regenerate it

## Notes

- Inline description (no spec file)
