# Current Task: Search Pages

Get the number of pages for a search query (GET /search/meta), so clients can paginate the /search results.

## Status

In Progress

## Goals

- Create new route `GET /search/meta`
- Return `{ nbPages }`, the number of pages for a specific search query

## Notes

- Should mirror the `/search` matching logic (title matches in `Discussion`, message matches in `Message`, deduped by message id) so `nbPages` is consistent with what `/search` actually paginates
- Pages are 20 results per page, matching `/search`
