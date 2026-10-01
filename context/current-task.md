# Current Task: Delete Warning

Let moderators and the admin delete a warning, unbanning the user when they drop back below the warning limit.

## Status

Complete

## Goals

- Create route `DELETE /warning/:warningId`, accessible to moderators and the admin only
- Delete the warning whose id is `warningId`; return 404 if it doesn't exist
- If the user's number of warnings becomes `warningLimit - 1` (Config table), unban the user (set `active` to `true` in the User table)
- Create the `authorizeModeratorAdmin` middleware (based on `authorizeAdmin`) and use it on the route
- Document the endpoint with apidoc, update apidoc.json and regenerate the documentation

## Notes

- Spec: `context/features/14-delete-warning-spec.md`
- Regular users get 401 Unauthorized from `authorizeModeratorAdmin`, like `authorizeAdmin`
