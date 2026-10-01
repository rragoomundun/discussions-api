# Current Task: Set User Active Status

Set a user's `active` field.

## Status

Complete

## Goals

- Create route `PUT /user/:userId/active`
- Read the `active` field from the body and validate that it is a boolean
- Update the `active` field of the specified user; return 404 if the user doesn't exist
- Only a regular user's status can be changed (403 for a moderator or the admin)

## Notes

- Spec: `context/features/16-set-user-active-status-spec.md`
- Only a moderator or the administrator can call this route
