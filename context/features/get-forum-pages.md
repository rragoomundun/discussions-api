# Get Discussion Pages

## Overview

Get the number of pages in a forum.

## Requirements

- Create route [GET] /discussion/pages
- Returns the number of pages in a forum
- The number of page is Math.ceil(nbDiscussions / NB_DISCUSSIONS_PER_PAGE)
- Read the forum id from query parameter forumId

## Notes

- There can be a maximum number of 20 discussions per page
