# Current Task: User Messages Category

## Status

Implemented (pending review)

## Goals

- `GET /user/:id/messages` (`getUserMessages` in [controllers/user.controller.js](controllers/user.controller.js)) should also return `category { id, name }` for each message

## Notes

- Spec source: `context/fixes/3-user-messages-category-spec.md`
- Same pattern as the prior `discussion-place` fix ([controllers/user.controller.js](controllers/user.controller.js) already imports `Category` from that fix) — extend the existing `Discussion -> Forum` nested include on `getUserMessages` to also include `Category` (`Forum -> Category`).
- Response shape currently is `{ discussion, forum, message }` per entry — spec doesn't say where `category` sits relative to `forum`/`message`; adding it as a sibling top-level key (`{ discussion, forum, category, message }`), matching how `discussion-place` added `category` as a sibling of `forum` rather than nesting it under `forum`.
- Update the `UserGetUserMessages` apidoc block and regenerate docs.
