import { createChannel, createSession } from "better-sse";
import { formatDistanceToNowStrict } from "date-fns";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Comment, knexObj, User } from "../bookshelf";

export const auth = async (req: Request, res: Response, next) => {
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

  const usersCheck = await knexObj("users").where({ id: res.locals.userId });
  if (usersCheck.length === 0) {
    res.status(401).send();
    return;
  }

  next();
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.fetchAll();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).send();
  }
};

export const getComments = async (req: Request, res: Response) => {
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
};

export const createComment = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  new Comment({
    comment: req.body["comment"],
    user: res.locals.userId,
  })
    .save()
    .then(() => res.status(201).send())
    .catch((e) => {
      console.error(e);
      res.status(500).send();
    });
};

// Version 1 of upvote handlers

export const addUpvote = async (req: Request, res: Response) => {
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
};

export const removeUpvote = async (req: Request, res: Response) => {
  knexObj("upvotes")
    .where({ user: res.locals.userId, comment: req.params.id })
    .delete()
    .then(() => res.status(200).send())
    .catch((e) => {
      console.log(e);
      res.status(500).send();
    });
};

// Version 2 handlers

export const channel = createChannel();

export const createCommentV2 = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const comment = {
    comment: req.body["comment"],
    user: res.locals.userId,
    parent_comment_id: req.body["parent_comment_id"],
  };

  new Comment(comment)
    .save()
    .then((c) => {
      // comment["id"] = c.id;
      res.status(201).send();
      channel.broadcast(c, "comment");
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send();
    });
};

export const addUpvoteV2 = async (req: Request, res: Response) => {
  const upvote = { user: res.locals.userId, comment: req.params.id };
  // Resolve to using Knex directly because Bookshelf doesn't seem to support ignoring conflicts
  knexObj("upvotes")
    .insert(upvote)
    .onConflict(["user", "comment"])
    .ignore()
    .then(() => {
      res.status(201).send();
      channel.broadcast({ ...upvote, add: true }, "upvote");
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send();
    });
};

export const removeUpvoteV2 = async (req: Request, res: Response) => {
  const upvote = { user: res.locals.userId, comment: req.params.id };
  knexObj("upvotes")
    .where(upvote)
    .delete()
    .then(() => {
      res.status(200).send();
      channel.broadcast({ ...upvote, add: false }, "upvote");
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send();
    });
};

export const updates = async (req: Request, res: Response) => {
  const session = await createSession(req, res);
  channel.register(session);
};
