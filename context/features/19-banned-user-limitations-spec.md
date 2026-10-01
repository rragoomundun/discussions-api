# Banned user limitations

## Overview

Add limitations to what a banned user can do.

## Requirements

- Create middleware activeUser that checks if a user is active. If active then continue otherwise return Unauthotized
- Add this middleware to the following routes:
  - POST /discussion
  - PUT /discussion/:discussionId
  - DELETE /discussion/:discussionId
  - POST /message
  - PUT /message/:messageId
  - DELETE /message/:messageId
