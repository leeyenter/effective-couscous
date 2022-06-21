import express from "express";
import { body } from "express-validator";

import {
  addUpvoteV2,
  auth,
  createCommentV2,
  getComments,
  getUsers,
  removeUpvoteV2,
  updates,
} from "./handlers";

const commentsRouter = express.Router();
commentsRouter.use(auth);
commentsRouter
  .route("/")
  .get(getComments)
  .post(body("comment").notEmpty(), createCommentV2);

const upvoteRouter = express.Router();
upvoteRouter.use(auth);
upvoteRouter.route("/:id").put(addUpvoteV2).delete(removeUpvoteV2);

export const v2Router = express.Router();

v2Router.get("/users", getUsers);
v2Router.use("/comments", commentsRouter);
v2Router.use("/upvote", upvoteRouter);
v2Router.get("/updates", updates);
