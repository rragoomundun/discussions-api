# Current Task: Set User Role

Change a user's role.

## Status

Complete

## Goals

- Create route `PUT /user/:userId/role`
- Read `role` from the body; it must be `regular` or `moderator`
- Set the user's role; return 404 if the user doesn't exist
- The admin's role cannot be changed (403)

## Notes

- Spec: `context/features/18-set-user-role-spec.md`
- Only the administrator can change a user role
