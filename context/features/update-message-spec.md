# Update Message

## Overview

Update a user message.

## Requirements

- Create route [PUT] /message/:messageId
- Read fields message and editionComment from body and update the message
- Set editedDate to the current date
- Set editionComment is any
- Return the updated message with the fields: id, message, date, editedDate, editionComment, author {id, name, image, signature} and editor {id, name}

## Notes

- Only the owner of a message, a moderator, or the admin can update a message
- A moderator cannot update an admin message
- The admin can update a moderator message
- If the message is updated by someone else than its owner set editorId to the editor id
