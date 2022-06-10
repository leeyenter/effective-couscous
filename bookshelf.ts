const config = require("./knexfile").development;

export const knexObj = require("knex")(config);
export const bs = require("bookshelf")(knexObj);

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
