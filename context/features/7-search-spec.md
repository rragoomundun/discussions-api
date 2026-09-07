# Search

## Overview

Search the forum.

## Requirements

- Create new route GET /search
- Read query from query parameters
- Read page from query parameters
- Search for matches in title field of Discussion model
- Search for matches in message field of Message model
- Populate an array with the matched elements. Each element must contains the following fields: { discussion: { id, title }, forum: { id, name }, category { id, name }, message { id, message, date }, user { id, name, role } }
- Return the array with the elements

## Notes

- If there is a match with discussion title, get the first message of the discussion and add it to the element with field message { id, message, date }
- Only get the first 300 characters of the message. Show "..." if there is more than 300 characters
- If there are messages with the same id, only keep one and remove the others
- Get the elements 20 by 20
- If there is a page query parameter, get the elements for the specific page
- The user field is the author of the message
