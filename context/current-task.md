# Current Task: Set Warning Limit

Set the forum's warning limit stored in the Config table.

## Status

Complete

## Goals

- Create route `PUT /config/warning-limit`, accessible to the administrator only
- Read `limit` from the request body and set `warningLimit` in the Config table to it
- Validate that `limit` is an integer greater than or equal to 5
- Document the endpoint with apidoc, update apidoc.json and regenerate the documentation

## Notes

- Spec: `context/features/11-set-warning-limit-spec.md`
- Follow the existing admin routes in `routes/config.route.js` (`authorizeMiddleware`, `authorizeAdminMiddleware`) and add a validator in `validators/config.validator.js`
- 5 is allowed: the smallest accepted value is 5
