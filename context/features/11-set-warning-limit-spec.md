# Set warning limit

## Overview

Set the value of warningLimit

## Requirements

- Create route {PUT} /config/warning-limit
- Read the limit field from the body
- Set the warningLimit field in Config table to limit

## Notes

- limit has to be an integer greater than 5
- This route is only accessible to the administrator
