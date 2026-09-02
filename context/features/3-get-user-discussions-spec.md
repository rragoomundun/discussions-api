# Get user discussions

## Overview

Get the discussions created by a user.

## Requirements

- Get the discussions started by a user
- Have a pagination system that allows to get discussions by blocks of 20 discussions
- Sort discussions by createdAt field: most recent first
- For each discussions, get:
  - id
  - title
  - open
  - createdAt
  - user
    - id
    - name
    - role
  - nbMessages
  - lastMessage
    - messageId
    - date
    - user
      - id
        -name

Follow the same naming conventions that is used in /discussion/all return.
