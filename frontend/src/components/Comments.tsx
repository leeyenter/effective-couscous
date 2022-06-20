import { useContext, useState } from "react";
import { Context } from "../Context";
import { Comment } from "./Comment";

export const Comments = () => {
  const ctx = useContext(Context);

  return (
    <div id="comments">
      {ctx.comments.map((c) => (
        <Comment comment={c} />
      ))}
    </div>
  );
};
