# Create warning

## Overview

Create a new warning.

## Requirements

- Create route {POST} /warning
- Read from the body the following fields: message, date, userId
- Create the warning
- If the number of warning exceeds warningLimit (available in Config table), automatically ban the user (set active field in User table to false)

## Notes

- Only moderators and the admin can create a warning
- A moderator cannot add a warning to another moderator or the admin
- Get the moderatorId from req.user.id
