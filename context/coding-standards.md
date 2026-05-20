# Coding Standards

## JavaScript

- Use ES modules

## File Organization

- Classes: `classes/[class].js`
- Controllers: `controllers/[controller].js`
- Routes: `routes/[route].js`
- Crons: `crons/[cron].js`
- Middlewares: `middlewares/[middleware].js`
- Utilities: `utils/[util].js`
- Validators: `validators/[validator].js`
- Models: `models/[model].js`

## Naming

- Models: PascalCase (`BottomLink.js`)
- Files: Match component name or kebab-case except for models files
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE

## Database

- Use Sequelize for all database operations

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible
