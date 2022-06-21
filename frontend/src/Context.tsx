import React from "react";

export interface UserInterface {
  id: number;
  name: string;
  pic: string;
}

export interface CommentInterface {
  id: number;
  comment: string;
  user: number;
  created: Date;
  createdPretty: string;
  upvotes: any[];
  parent_comment_id?: number;
}

export const defaultUser: UserInterface = { id: 0, name: "", pic: "" };
const emptyUsers: UserInterface[] = [];
const emptyComments: CommentInterface[] = [];

export const Context = React.createContext({
  user: defaultUser,
  users: emptyUsers,
  changeUser: () => {},
  comments: emptyComments,
  fetchComments: () => {},
  addUpvote: (id: number) => {},
  removeUpvote: (id: number) => {},
});
