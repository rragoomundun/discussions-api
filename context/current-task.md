# Current Task: Create Warning

Let moderators and the admin give a warning to a user, banning the user automatically once they pass the warning limit.

## Status

Complete

## Goals

- Create route `POST /warning`, accessible to moderators and the admin only
- Read `message` and `userId` from the request body (`date` is not read from the body and uses its default, now); take `moderatorId` from `req.user.id`
- Create the warning
- A moderator cannot warn another moderator or the admin
- Nobody can warn themselves
- A banned user (`active` is `false`) cannot be warned
- If the user's number of warnings reaches `warningLimit` (Config table), ban the user (set `active` to `false` in the User table)
- Add a validator for the body fields
- Make `message` nullable in the Warning table (model + new migration)
- Document the endpoint with apidoc, update apidoc.json and regenerate the documentation

## Notes

- Spec: `context/features/13-create-warning-spec.md`
- New files: `routes/warning.route.js`, `controllers/warning.controller.js`, `validators/warning.validator.js`; mount the router in `server.js`
- Role checks follow the existing pattern in `controllers/message.controller.js`
- Return 404 if `userId` doesn't match an existing user
