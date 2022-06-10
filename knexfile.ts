module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "::1",
      port: 5432,
      user: "postgres",
      password: "mysecretpassword",
      database: "postgres",
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL + "?ssl=true",
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
