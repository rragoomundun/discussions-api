# Current Task: User Profile Image

## Status

Implemented (pending review)

## Goals

- `GET /user/:id` (`getUserProfile` in [controllers/user.controller.js](controllers/user.controller.js)) should also return the `image` field

## Notes

- Spec source: `context/fixes/1-user-profile-image-spec.md`
- Currently `getUserProfile` only selects/returns `name`, `role`, `nbDiscussions`, `nbMessages`, `createdAt` — needs `image` added to both the `attributes` list and the JSON response.
- Update the apidoc block for `UserGetUserProfile` to document the new field and regenerate docs.
