import express from "express";
import { body } from "express-validator";
import {
  addUpvote,
  auth,
  createComment,
  getComments,
  removeUpvote,
  getUsers,
} from "./handlers";

const commentsRouter = express.Router();
commentsRouter.use(auth);
commentsRouter
  .route("/")
  .get(getComments)
  .post(body("comment").notEmpty(), createComment);

const upvoteRouter = express.Router();
upvoteRouter.use(auth);
upvoteRouter.route("/:id").put(addUpvote).delete(removeUpvote);

export const v1Router = express.Router();
v1Router.get("/users", getUsers);
v1Router.use("/comments", commentsRouter);
v1Router.use("/upvote", upvoteRouter);
