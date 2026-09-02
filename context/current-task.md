# Current Task: Get User Information

## Status

Implemented (pending review)

## Goals

- Create route `GET /user/:id/informations`
- Route returns the following fields for a specific user:
  - `birthday`
  - `location`
  - `gender`
  - `biography`

## Notes

- Spec source: `context/features/1-get-user-information-spec.md`
- Complements the existing public profile route `GET /user/:id` ([GET /user/:id](context/features/1-user-profile-spec.md)) which returns name/role/nbDiscussions/nbMessages/createdAt — this route adds the remaining public profile fields.
- `birthday` should follow the existing `YYYY-MM-DD` formatting convention used in `GET /user` ([controllers/user.controller.js](controllers/user.controller.js)).
- Not specified: behavior for a nonexistent user id — follow the 404 pattern used elsewhere (e.g. `GET /user/:id`).
