# Current Task: Get User Discussions Meta

## Status

Implemented (pending review)

## Goals

- Create route `GET /user/:id/discussions/meta`
- Return `nbPages` — total number of pages (20 discussions/page) for the user's discussions

## Notes

- Spec source: `context/features/5-get-user-discussions-meta-spec.md`
- Mirrors the existing `GET /forum/:forumId/meta` pattern in [controllers/forum.controller.js](controllers/forum.controller.js): `nbPages = Math.max(1, Math.ceil(count / 20))`, using `Discussion.count({ where: { userId } })`.
- Unlike `getForumMeta` (which 404s if the forum doesn't exist), this endpoint counts the same way `GET /user/:id/discussions` and `GET /user/:id/messages` already do — no existence check, so a nonexistent/empty user simply returns `{ nbPages: 1 }` (the `Math.max(1, ...)` floor). Chosen for consistency with those two sibling list endpoints rather than the single-resource `getForumMeta`/`GET /user/:id` pattern.
- Reuse the `USER_DISCUSSIONS_PER_PAGE = 20` constant already defined in [controllers/user.controller.js](controllers/user.controller.js) for `getUserDiscussions`.
