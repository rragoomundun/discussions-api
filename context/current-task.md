# Current Task: Add User Image to Search Results

For route GET /search, also return the user's image in the `user` field of each result.

## Status

In Progress

## Goals

- In the `GET /search` response, add `image` to the `user` object (alongside existing `id`, `name`, `role`)

## Notes

- Source: `User.image` (the author of the matched message)
- Scope is `/search` only — `/search/meta` (which only returns `{ nbPages }`) is unaffected
