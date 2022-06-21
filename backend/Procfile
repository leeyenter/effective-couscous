web: node dist/app.js
release: npx knex migrate:latest --knexfile dist/knexfile.js; npx knex seed:run --knexfile dist/knexfile.js
