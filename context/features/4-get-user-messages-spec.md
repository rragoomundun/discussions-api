# Get user messages

## Overview

Get the messages posted by a specific user.

## Requirements

- Create route /user/:id/messages
- Have a pgination system that get 20 messages per page
- For each message return:
  - discussion
    - id
    - title
    - page (the page where the message is posted)
  - forum
    - id
    - title
  - message
    - id
    - message
    - date
