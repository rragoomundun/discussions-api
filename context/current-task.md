# Current Task: Search

Search the forum for matches in discussion titles and messages, returning paginated results (GET /search).

## Status

In Progress

## Goals

- Create new route `GET /search`
- Read `query` from query parameters
- Read `page` from query parameters
- Search for matches in the `title` field of the `Discussion` model
- Search for matches in the `message` field of the `Message` model
- Populate an array of matched elements, each with fields:
  `{ discussion: { id, title }, forum: { id, name }, category: { id, name }, message: { id, message, date }, user: { id, name, role } }`
- Return the array of elements

## Notes

- For a discussion-title match, use the discussion's first message for the `message { id, message, date }` field
- Truncate `message` to the first 450 characters; append "..." if the original is longer than 450 characters
- De-duplicate results: if multiple elements share the same message id, keep only one
- Paginate 20 elements per page; use the `page` query parameter to select the page (default to page 1 if absent)
- The `user` field is the author of the message
