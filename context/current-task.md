# Current Task: Discussion Pinned

Add and manage a `pinned` field for discussions.

## Status

Complete

## Goals

- Create a database migration adding the `pinned` field to the Discussion table (boolean, default `false`)
- Add the `pinned` field to the Discussion model
- Create route `PUT /discussion/:discussionId/pinned` to set the pinned flag of a specific discussion
- Return the `pinned` flag for each item of `GET /discussion/all`
- Return the `pinned` flag in `GET /discussion/:discussionId`

## Notes

- Spec: `context/features/20-discussion-pinned-spec.md`
- Only moderators or the administrator can call `PUT /discussion/:discussionId/pinned`
- No restriction based on the discussion author (unlike `setDiscussionOpen`)
- `GET /discussion/all` ordering is unchanged; sorting pinned discussions first will be another feature
- Don't run the migration; the user runs it
