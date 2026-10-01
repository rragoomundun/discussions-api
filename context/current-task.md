# Current Task: Get Warnings

Get the warnings for a specific user.

## Status

Complete

## Goals

- Create route `GET /warning/all`, public (anyone can call it)
- Take the query parameter `userId` (the user id), validated as a required integer
- Return all the user's warnings as `[{ id, message, date }]`, ordered by `date` DESC
- Document the endpoint with apidoc, update apidoc.json and regenerate the documentation

## Notes

- Spec: `context/features/15-get-warnings-spec.md`
- A non-existent `userId` returns `[]` (no 404 check, not required by the spec)
