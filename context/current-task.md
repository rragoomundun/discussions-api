# Current Task: Discussion Place

## Status

Implemented (pending review)

## Goals

- `GET /discussion/all` (`getDiscussionsInForum` in [controllers/discussion.controller.js](controllers/discussion.controller.js)) should also return `category { id, name }` and `forum { id, name }` for each discussion
- `GET /user/:id/discussions` (`getUserDiscussions` in [controllers/user.controller.js](controllers/user.controller.js)) should also return `category { id, name }` and `forum { id, name }` for each discussion

## Notes

- Spec source: `context/fixes/2-discussion-place-spec.md`
- Loaded via `/fix` (not `/feature`) — the spec lives in `context/fixes/`, numbered to continue from the `user-profile-image` fix.
- Both endpoints currently query `Discussion` scoped by `forumId` or `userId` respectively, without including `Forum`/`Category`. Need to add nested includes: `Discussion -> Forum (as: 'forum') -> Category (as: 'category')`, matching the shape already used in `GET /discussion/:discussionId` (`forum: {id, name}`, `category: {id, name}`).
- For `getUserDiscussions`, since discussions can span different forums, the `forumId` isn't fixed like it is in `getDiscussionsInForum` — need the forum/category info per-discussion via include, not a single shared value.
- Update apidoc blocks for both `DiscussionGetDiscussionsInForum` and `UserGetUserDiscussions`, regenerate docs.
