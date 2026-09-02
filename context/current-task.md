# Current Task: Get User Discussions

## Status

Implemented (pending review)

## Goals

- Create route `GET /user/:id/discussions` (not explicit in spec; inferred from `/user/:id` and `/user/:id/informations` naming convention)
- Return the discussions started by the given user
- Paginate results in blocks of 20 (same convention as `GET /discussion/all`: `page` query param, 20 per page)
- Sort by `createdAt` descending (most recent first) — note this differs from `GET /discussion/all`, which sorts by last message date
- For each discussion, return:
  - `id`
  - `title`
  - `open`
  - `createdAt`
  - `user` — `id`, `name`, `role`
  - `nbMessages`
  - `lastMessage` — `messageId`, `date`, `user` (`id`, `name`), or `null` if none

## Notes

- Spec source: `context/features/3-get-user-discussions-spec.md`
- Spec explicitly says: "Follow the same naming conventions that is used in `/discussion/all` return." — implementation should mirror `getDiscussionsInForum` in [controllers/discussion.controller.js](controllers/discussion.controller.js) (same field names/shapes for `user`, `nbMessages`, `lastMessage`), but filtered by `userId` instead of `forumId`, and ordered by `createdAt` instead of last message date.
- `DISCUSSIONS_PER_PAGE = 20` constant already exists in discussion.controller.js — reuse or mirror it.
