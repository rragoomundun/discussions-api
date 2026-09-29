# Warning table

## Overview

Create Warning table.

## Requirements

- Create a table called Warning with the following fields:
  - id (INTEGER)
  - message (TEXT)
  - date (DATE, set it by default to NOW())
  - userId (INTEGER, a foreign key to an element of the User table)
  - moderatorId (INTEGER, a foreign key to an element of the User table)

## Notes

- Don't forget to create the migration for this table.
