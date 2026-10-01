# Current Task: Banned User Limitations

Add limitations to what a banned user can do.

## Status

Complete

## Goals

- Create the `activeUser` middleware: continue if the user is active, otherwise return Unauthorized
- Add the middleware to the following routes:
  - `POST /discussion`
  - `PUT /discussion/:discussionId`
  - `DELETE /discussion/:discussionId`
  - `POST /message`
  - `PUT /message/:messageId`
  - `DELETE /message/:messageId`

## Notes

- Spec: `context/features/19-banned-user-limitations-spec.md`
- `active` is added to `req.user` in the authorize middleware so `activeUser` needs no extra query
