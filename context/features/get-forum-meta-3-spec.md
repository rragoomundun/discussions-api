# Get Discussion in Forum Meta 3

## Overview

Get meta informations of a forum.

## Requirements

- Create route [GET] /forum/:forumId/meta to get a forum meta information
- Get the forum information as `name`, `id`
- Get the forum category information as `category {id, name}`
- Get the number of pages as `nbPages` in a forum. `nbPages` equals `Math.ceil(nbDiscussions / DISCUSSIONS_PER_PAGE)`
- Modify API `/discussion/all` to only return an array containing the discussions: `[{id, title, open, createdAt, user {id, name}, nbMessages, lastMessage {messageId, date, user {id, name}}}]`
- Delete API DiscussionGetDiscussionPages
