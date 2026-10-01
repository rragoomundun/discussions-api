# Discussion pinned

## Overview

Add and manage pinned field for discussions.

## Requirements

- Create a database migration to add the pinned field to table Discussion. This field is a boolean and is by default equals to false
- Update Discussion model to add the pinned flag
- Create route PUT /discussion/:discussionId/pinned to set the pinned flag of a specific discussion
- When calling route GET /discussion/all, return for each item the pinned flag
- When calling route GET /discussion/:discussionId, return the pinned flag

## Notes

- Only the moderators or the administrator can call the route PUT /discussion/:discussionId/pinned
