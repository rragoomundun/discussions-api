# Get warnings

## Overview

Get the warnings for a specific user.

## Requirements

- Create route GET /warning/all
- The route takes query parameter userId corresponding to the user id
- Get all warnings (returns [{ id, message, date }]) for the specific user ordered by date DESC
