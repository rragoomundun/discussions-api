# Current Feature

## Status

## Goals

## Notes

## History

<!-- Keep this updated. Earliest to latest -->
- **20-05-26 — Claude Code Initialization** — Added `.claude/` skills folder and `CLAUDE.md` project configuration file.
- **20-05-26 — Claude Code Configuration 2** — Added `/hotfix` skill, updated feature skill for git flow, added apidoc section to coding standards, fixed model indentation.
- **26-05-29 — Upload Middleware Filename** — Upload filenames now use `Date.now()` + mime-derived extension instead of the original filename.
- **26-05-30 — Format Birthday in getUser** — `birthday` in `getUser` now returns as `YYYY-MM-DD` string instead of a raw date.
- **26-05-30 — Get Forum in Category** — Added `GET /category/:categoryId/forum` endpoint returning a category with its nested forums.
- **26-05-30 — Create Discussion** — Added `Discussion` model, migration, and `POST /discussion` endpoint with auth and validation.
- **26-05-30 — Update Discussion** — Added `PUT /discussion/:discussionId` endpoint; restricted to owner, moderators, and admin.
- **26-05-30 — Get Discussion** — Added `GET /discussion/:discussionId` endpoint returning `id`, `title`, `open`, `forum: { id, name }`, `category: { id, name }`.
- **26-05-31 — Delete Discussion** — Added `DELETE /discussion/:discussionId` endpoint; restricted to moderators and admin.
- **26-05-31 — Message Model** — Added `Message` Sequelize model, migration, and associations (Discussion↔Message, Message↔User author/editor).
- **26-05-31 — Get Discussions in Forum** — Added `GET /discussion/all?forumId&page` endpoint; 20/page, ordered by most recent last message; returns discussion with user and lastMessage fields. Also added `date` field to `Message` model.
- **26-05-31 — Discussion Page Count** — `GET /discussion/:discussionId` now returns a `pages` field (total message pages, 20 per page, minimum 1).
- **26-05-31 — Set Discussion Open** — Added `PUT /discussion/:discussionId/open` endpoint; sets the `open` boolean; restricted to moderators and admin.
- **26-05-31 — Get Messages in Discussion** — Added `GET /message/all?discussionId&page` endpoint; 20/page, ordered oldest to newest; returns messages with `author` and optional `editor` fields.
- **26-05-31 — Get Messages: Extend Author Fields** — `author` in `GET /message/all` now also returns `image` and `signature`.
- **26-05-31 — Get Discussion Pages** — Added `GET /discussion/pages?forumId` endpoint returning `{ pages }` (Math.ceil(count / 20)).
- **26-05-31 — Post Message** — Added `POST /message` endpoint; auth required; body: `message`, `discussionId`; returns message with `author: { id, name, image, signature }`.
- **26-05-31 — Update Message** — Added `PUT /message/:messageId` endpoint; restricted to owner, moderators (not on admin/moderator messages), and admin; sets `editedDate`, optional `editionComment`, and `editorId` when not the owner; returns message with `author { id, name, image, signature }` and `editor { id, name }`.
- **26-05-31 — Delete Message** — Added `DELETE /message/:messageId` endpoint; restricted to moderators and admin; moderator cannot delete an admin's message.
- **26-05-31 — Get Forum Meta** — `GET /forum` now returns `nbDiscussions`, `nbMessages`, and `lastMessage: { discussion: { id, name }, date }` per forum.
- **26-05-31 — Get Forum in Category Meta** — `GET /category/:categoryId/forum` now returns `nbDiscussions`, `nbMessages`, and `lastMessage: { discussion: { id, name }, date }` per forum.
- **26-05-31 — Get Discussions in Forum Meta** — `GET /discussion/all` now returns `nbMessages` (total message count) per discussion.
- **26-06-02 — Get Discussions in Forum Meta 2** — `GET /discussion/all` response now wraps discussions in `{ category, forum, discussions: [...] }` instead of a bare array.
- **26-06-02 — Get Forum Meta 3** — Added `GET /forum/:forumId/meta` returning `{ id, name, category, nbPages }`; reverted `GET /discussion/all` to a bare array; deleted `GET /discussion/pages` endpoint.
- **26-06-02 — Get Forum Meta — Description Fields** — `GET /forum/:forumId/meta` now also returns `description` and `metaDescription` from the Forum model.
- **26-06-04 — Get Messages: Author Role and isStarter** — `author` in `GET /message/all` now returns `role` and `isStarter` (true when the author is the discussion creator).
