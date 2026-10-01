# Current Task: Pinned Discussions First

Get pinned discussions first.

## Status

Complete

## Goals

- Modify `GET /discussion/all` to return the pinned discussions first
- Update the endpoint documentation and regenerate it

## Notes

- Spec: `context/features/21-pinned-discussions-first-spec.md`
- The spec says `PUT /discussion/all`, but the route is `GET /discussion/all` (`getDiscussionsInForum`)
