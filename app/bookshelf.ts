import knex from "knex";
import bookshelf from "bookshelf";
// import knexConfig from './knexfile.';

const config = require("./knexfile.ts").development;

export const knexObj = knex(config);

export const bs = bookshelf(knexObj);

export const User = bs.model("User", {
  tableName: "users",
});

export const Upvote = bs.model("Upvote", {
  tableName: "upvotes",
});

export const Comment = bs.model("Comment", {
  tableName: "comments",
  author() {
    return this.belongsTo("User");
  },
  upvotes() {
    return this.hasMany("Upvote");
  },
});
