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
    connection: {
      host: "::1",
      port: 5432,
      user: "root",
      password: "my-secret-pw",
      database: "mydb",
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
