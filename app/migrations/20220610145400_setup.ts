import * as Knex from "knex";

const addUserIdCol = (table: Knex.CreateTableBuilder) => {
  table.integer("user").unsigned().notNullable();
  table.foreign("user").references("id").inTable("users").onDelete("CASCADE");
};

const addCommentIdCol = (table: Knex.CreateTableBuilder) => {
  table.integer("comment").unsigned().notNullable();
  table
    .foreign("comment")
    .references("id")
    .inTable("comments")
    .onDelete("CASCADE");
};

export async function up(knex: Knex): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      await Promise.all([
        knex.schema.createTable("users", (table) => {
          table.increments();
          table.string("name").notNullable();
          table.string("pic").notNullable();
        }),
        knex.schema.createTable("comments", (table) => {
          table.increments();
          table.text("comment").notNullable();
          table.timestamp("created").notNullable().defaultTo(knex.fn.now());
          addUserIdCol(table);
        }),
        knex.schema.createTable("upvotes", (table) => {
          table.increments();
          addUserIdCol(table);
          addCommentIdCol(table);
          table.unique(["user", "comment"]);
        }),
      ]);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("comments");
}
