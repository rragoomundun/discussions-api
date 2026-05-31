# Get Forum in Category

## Overview

Get a category and its forums

## Requirements

- Create a /category/:categoryId/forum GET request
- The request need to return the following fields: id, name, description, metaDescription, forums

## Notes

- The forums field is an array containing all forums in that category. It contains the following fields: id, name, description, metaDescription, index
