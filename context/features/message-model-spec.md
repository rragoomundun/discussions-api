# Message Model

## Overview

Implement message model.

## Requirements

- Create message model with the following properties: id (integer, primary key), message (text), editedDate (date), editionComment (text), discussionId (integer, foreign key), authorId (integer, foreign key), editorId (integer, foreignKey)
- Create migrations

## Notes

- authorId and editorId refers to the User model
- editorId can be NULL
