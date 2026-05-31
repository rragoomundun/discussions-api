# Get Forum in Category Meta

## Overview

Get extra informations when fetching the forums in the category.

## Requirements

- When calling the route /category/:categoryId/forum returns for each forum: nbDiscussions (the number of discussions), nbMessages (the number of messages), lastMessage: { discussion: {id, name} , date}
