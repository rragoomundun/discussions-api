# Current Task: User Profile

## Status

Implemented (pending review)

## Goals

- Create route `GET /user/:id`
- Route returns the following information for a specific user:
  - `name`
  - `role`
  - `nbDiscussions` (number of discussions started)
  - `nbMessages` (number of messages posted)
  - `createdAt`

## Notes

- Spec source: `context/features/1-user-profile-spec.md`
- `nbDiscussions` and `nbMessages` are computed counts (Discussion/Message rows associated to the user), not stored fields on the User model.
- Overview and edge cases (e.g. inactive/nonexistent user handling) not specified in the spec — clarify during implementation if needed.
