# Discussions API

API for the Discussions forum software.

## Usage

Rename file **config.env** to **.env** and update the values.

### config.env example

```
# The port to use
PORT=5000


# The server execution environment (dev or prod)
ENV=dev


# The maximum number of requests per minute (only used in prod mode)
RATE_LIMIT=100


# The application frontend url
APP_URL=http://localhost:4200


# JWT Token secret code
JWT_SECRET=secret

# JWT Token duration. On this example it will expire in 180 days
JWT_EXPIRE=180d

# JWT Token cookie duration. The value is in days.
JWT_COOKIE_EXPIRE=180


# SMTP user name
SMTP_USER=username

# SMTP password
SMTP_PASSWORD=password
```

## Migrations

Rename **migrations/config/config.example.json** to **migrations/config/config.json** and update the values.

### config.json example

```
{
  "development": {
    "username": "developmentuser",
    "password": "developmentpassword",
    "database": "developmentdatabase",
    "host": "developmenthost",
    "dialect": "postgres",
    "migrationStorageTableName": "migrations"
  },
  "test": {
    "username": "testuser",
    "password": "testpassword",
    "database": "testdatabase",
    "host": "testhost",
    "dialect": "postgres",
    "migrationStorageTableName": "migrations"
  },
  "production": {
    "username": "productionuser",
    "password": "productionpassword",
    "database": "productiondatabase",
    "host": "productionhost",
    "dialect": "postgres",
    "migrationStorageTableName": "migrations"
  }
}
```

### Commands

```
# Create a new migration called migration-name
npm run migration:create -- --name migration-name

# Apply the migration
npm run migration:migrate

# Cancel the migration
npm run migration:rollback
```

## Generate documentation

```
npm run gendoc
```

## Run API

```
npm run start
```

- Version: 0.2
- License: MIT
- Author: Raphael Ragoomundun
