# Current Task: Get User Messages

## Status

Implemented (pending review)

## Goals

- Create route `GET /user/:id/messages`
- Paginate results, 20 messages per page (`page` query param, same convention as `GET /message/all` and `GET /user/:id/discussions`)
- For each message, return:
  - `discussion` — `id`, `title`, `page` (the page number within the discussion, at 20 msgs/page, where this message appears)
  - `forum` — `id`, `name`
  - `message` — `id`, `message`, `date`

## Notes

- Spec source: `context/features/4-get-user-messages-spec.md`
- Spec says `forum.title`, but the Forum model has no `title` field — it's `name` (confirmed in [models/Forum.js](models/Forum.js) and used as `forum.name` everywhere else, e.g. `GET /discussion/:discussionId`). Using `name` to match the existing convention.
- Spec doesn't state a sort order for the message list itself (unlike the discussions feature, which specified "most recent first"). Planning to default to `date DESC` (most recent first), consistent with the other user-listing endpoints — flag if a different order is wanted.
- The per-message `discussion.page` requires ranking each message within its own discussion by `date ASC` (same ordering as `GET /message/all`), then `page = ceil(rank / 20)` — needs a windowed query (`ROW_NUMBER() OVER (PARTITION BY discussionId ...)`) since it depends on the full discussion, not just the fetched page of the user's messages.
