import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("comments", function (table) {
    table.integer("parent_comment_id");
    table
      .foreign("parent_comment_id")
      .references("id")
      .inTable("comments")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("comments", function (table) {
    table.dropColumn("parent_comment_id");
  });
}
