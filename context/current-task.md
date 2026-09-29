# Current Task: Get Warning Limit

Return the forum's warning limit stored in the Config table.

## Status

Complete

## Goals

- Add an endpoint returning the `warningLimit` value from the Config table
- Response format: `{ limit }`
- Document the endpoint with apidoc and regenerate the documentation
- Update the ConfigGet documentation to include the `warningLimit` field

## Notes

- Spec: `context/features/10-get-warning-limit-spec.md`
- Spec does not specify the route or access level; likely `GET /config/warning-limit` in `routes/config.route.js`, handled in `controllers/config.controller.js`
