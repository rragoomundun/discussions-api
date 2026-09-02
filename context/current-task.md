# Current Task: Get User Messages Meta

## Status

Implemented (pending review)

## Goals

- Create route `GET /user/:id/messages/meta`
- Return `nbPages` — total number of pages (20 messages/page) for the user's messages

## Notes

- Spec source: `context/features/6-get-user-messages-meta-spec.md`
- Mirrors `getUserDiscussionsMeta` (just added) and `getForumMeta`: `nbPages = Math.max(1, Math.ceil(count / 20))`, using `Message.count({ where: { authorId } })`.
- Same convention as the discussions-meta feature: no existence check, consistent with `GET /user/:id/messages` — a nonexistent user returns `{ nbPages: 1 }`.
- Reuse the `USER_MESSAGES_PER_PAGE = 20` constant already defined in [controllers/user.controller.js](controllers/user.controller.js) for `getUserMessages`.
