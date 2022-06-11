import { formatDistanceToNowStrict } from "date-fns";
import express from "express";
import { body, validationResult } from "express-validator";
import { Comment, knexObj, Upvote, User } from "../bookshelf";

const auth = (req, res, next) => {
  // Pseudo-authentication

  // Take id directly from authorization header
  if (req.headers.authorization === undefined) {
    res.status(401).send();
    return;
  }
  const token = req.headers.authorization.split(" ");
  if (token.length < 2) {
    res.status(401).send();
    return;
  }

  res.locals.userId = token[1];

  // Randomly select user ID
  // res.locals.userId = Math.ceil(Math.random() * 4);
  next();
};

const commentsRouter = express.Router();
commentsRouter.use(auth);
commentsRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const comments = await new Comment()
        .orderBy("created", "DESC")
        .fetchAll({ withRelated: ["upvotes"] });

      res.status(200).json(
        comments.map((c) => {
          c.attributes["createdPretty"] = formatDistanceToNowStrict(
            new Date(c.attributes.created),
            { addSuffix: true }
          );
          return c;
        })
      );
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  })
  .post(body("comment").notEmpty(), (req, res) => {
    const errors = validationResult(req);
    console.log(req.body);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    new Comment({
      comment: req.body["comment"],
      user: res.locals.userId,
    })
      .save()
      .then(() => res.status(201).send())
      .catch(() => res.status(500).send());
  });

const upvoteRouter = express.Router();
upvoteRouter.use(auth);
upvoteRouter
  .route("/:id")
  .put((req, res) => {
    // Resolve to using Knex directly because Bookshelf doesn't seem to support ignoring conflicts
    knexObj("upvotes")
      .insert({ user: res.locals.userId, comment: req.params.id })
      .onConflict(["user", "comment"])
      .ignore()
      .then(() => res.status(201).send())
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  })
  .delete((req, res) => {
    knexObj("upvotes")
      .where({ user: res.locals.userId, comment: req.params.id })
      .delete()
      .then(() => res.status(200).send())
      .catch((e) => {
        console.log(e);
        res.status(500).send();
      });
  });

export const v1Router = express.Router();
v1Router.get("/users", async (req, res) => {
  try {
    const users = await User.fetchAll();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).send();
  }
});
v1Router.use("/comments", commentsRouter);
v1Router.use("/upvote", upvoteRouter);
