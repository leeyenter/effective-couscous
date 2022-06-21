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

  test: {
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
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
