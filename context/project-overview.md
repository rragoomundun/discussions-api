# Discussions API — Project Overview

## Summary

Discussions API is the backend for a self-hosted forum platform. It lets anyone spin up their own forum where users can hold public discussions, post messages, and manage their profiles. The API is free and open source.

**Stack:** Node.js v22 · Express.js 5 · Sequelize ORM · PostgreSQL

---

## User Roles

| Role        | Capabilities                                                                         |
| ----------- | ------------------------------------------------------------------------------------ |
| `admin`     | Full control: forum config, categories/forums, bottom links, moderation of all users |
| `moderator` | Contribute to discussions, moderate regular users                                    |
| `regular`   | Contribute to discussions only                                                       |

---

## Feature Set (v1)

### All Users

#### Authentication

- Register with username, email, and password
- Confirm registration via emailed token
- Login / logout
- Initiate and complete password recovery via email

#### Profile

Every user has a public profile. Users can update their own: email, password, avatar, birthday, biography, location, gender, and signature.

Public profile displays:

- Role, registration date, status (active/inactive)
- Birthday, location, gender, biography
- Discussion count, message count
- All messages posted by that user
- All discussions started by that user

#### Discussions

- Any user can create or read a discussion

#### Messages

- Any user can post a message to a discussion

---

### Admin Only

#### General Settings

Configure site-wide settings:

- Forum title (and whether to show it in the header)
- Logo and favicon (and whether to show the logo in the header)
- Description and meta description
- Language

#### Forums Configuration

- Create, update, and delete **categories**
- Create, update, and delete **forums** within categories

#### Bottom Links

- Create, update, and delete footer navigation links

---

## Data Models

```
┌──────────────┐       ┌──────────────┐
│     User     │       │    Token     │
│──────────────│       │──────────────│
│ id           │◄──────│ id           │
│ name         │       │ value        │
│ email        │       │ expire       │
│ password     │       │ type         │
│ role         │       │ userId       │
│ image        │       └──────────────┘
│ birthday     │
│ biography    │       ┌────────────────┐
│ location     │       │    Config      │
│ gender       │       │────────────────│
│ signature    │       │ id             │
│ active       │       │ title          │
│ createdAt    │       │ logo           │
└──────┬───────┘       │ favicon        │
       │               │ description    │
       │               │ metaDescription│
       │               │ lang           │
       │               │ showTitle      │
       │               │ showLogo       │
       │               │ createdAt      │
       │               └────────────────┘
       │
       │  creates      ┌──────────────┐
       └──────────────►│  Discussion  │
                       │──────────────│
                       │ id           │
                       │ title        │◄──────────────────┐
                       │ open         │                   │
                       │ createdAt    │                   │
                       │ updatedAt    │                   │
                       │ forumId      │      ┌────────────┴─┐
                       │ userId       │      │   Message    │
                       └──────┬───────┘      │──────────────│
                              │              │ id           │
                              │ belongs to   │ message      │
                              ▼              │ date         │
                       ┌────────────────┐    │ editedDate   │
                       │    Forum       │    │ editedComment│
                       │────────────────│    │ discussionId │
                       │ id             │    │ authorId     │
                       │ name           │    │ editorId     │
                       │ description    │    └──────────────┘
                       │ metaDescription│
                       │ index          │
                       │ categoryId     │
                       └──────┬─────────┘
                              │ belongs to
                              ▼
                       ┌────────────────┐     ┌──────────────┐
                       │   Category     │     │  BottomLink  │
                       │────────────────│     │──────────────│
                       │ id             │     │ id           │
                       │ name           │     │ name         │
                       │ description    │     │ link         │
                       │ metaDescription│     │ index        │
                       │ index          │     └──────────────┘
                       └────────────────┘
```

### Field Reference

**User**
| Field | Type / Notes |
|---|---|
| `id` | PK |
| `name` | string |
| `email` | string, unique |
| `password` | bcrypt hash |
| `role` | `admin` \| `moderator` \| `regular` |
| `image` | file path/URL |
| `birthday` | date |
| `biography` | text |
| `location` | string |
| `gender` | `male` \| `female` |
| `signature` | text |
| `active` | boolean |
| `createdAt` | timestamp |

**Token**
| Field | Type / Notes |
|---|---|
| `id` | PK |
| `value` | hashed string |
| `expire` | timestamp |
| `type` | `register-confirm` \| `password-reset` |
| `userId` | FK → User |

**Config** (singleton, admin-managed)
| Field | Notes |
|---|---|
| `title` | Forum display name |
| `logo` / `favicon` | File paths/URLs |
| `description` / `metaDescription` | SEO fields |
| `lang` | Locale code |
| `showTitle` / `showLogo` | Boolean display toggles |

**Category** — ordered by `index`; has `name`, `description`, `metaDescription`

**Forum** — ordered by `index`; belongs to one Category; has `name`, `description`, `metaDescription`

**Discussion** — belongs to Forum and User (creator); has `title`, `open` (bool), `createdAt`, `updatedAt`

**Message** — belongs to Discussion; tracks `authorId`, `editorId`, `editedDate`, and optional `editedComment`

**BottomLink** — ordered by `index`; has `name` and `link`

---

## Monetization

Free and open source. No commercial plans for v1.
