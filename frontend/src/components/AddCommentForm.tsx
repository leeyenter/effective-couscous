import React, { useContext, useState } from "react";
import { API } from "../API";
import { Context } from "../Context";

export const AddCommentForm = (props: {
  parentId?: number;
  callback?: () => void;
}) => {
  const ctx = useContext(Context);
  const [comment, setComment] = useState("");

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    API.submitComment(ctx.user.id, comment, props.parentId).then(() => {
      setComment("");
      if (props.callback) props.callback();
    });
  };

  return (
    <form id="comment-box" onSubmit={submitForm}>
      <img
        src={ctx.user.pic}
        id="profile-pic"
        onClick={ctx.changeUser}
        alt="User's profile"
      />
      <input
        autoFocus
        type="text"
        placeholder="What are your thoughts?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button className="btn-primary">Comment</button>
    </form>
  );
};
