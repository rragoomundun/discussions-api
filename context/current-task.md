# Current Task: Move Discussion

Move a discussion to another forum.

## Status

Complete

## Goals

- Create route `PUT /discussion/:discussionId/move`
- Read `forumId` from the body (required integer of an existing forum)
- Update the discussion's `forumId` to the new forum id; return 404 if the discussion doesn't exist

## Notes

- Spec: `context/features/22-move-discussion-spec.md`
- Only moderators or the administrator can move a discussion (`authorizeModeratorAdmin` middleware)
