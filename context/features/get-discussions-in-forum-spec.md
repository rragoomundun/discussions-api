# Get Discussions in Forum

## Overview

Get the discussions in a specified forum

## Requirements

- Create route [GET] /discussion/all
- Have a pagination system. Return 20 discussions per page
- Order by the last message in a discussion. The discussion that have the most recent last message are returned before
- Return the following fields id, title, open, createdAt
- Return also a field user with the properties id, name
- Return also a field lastMessage with the properties date, messageId, user with the properties id, name

## Notes

- The forum id with specified by the query parameter forumId
- The route can take a page query parameter to specify which page we want
