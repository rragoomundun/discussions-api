# Get Messages in Discussion

## Overview

Get messages in a discussion.

## Requirements

- Create route [GET] /message/all
- The route takes two query parameter: discussionId and page
- The route returns the following fields: id, message, date, editedDate, editionComment, author (a User reference) as {id, name}, editor (a User reference) as {id, name}

## Notes

- Return at most 20 messages per page
