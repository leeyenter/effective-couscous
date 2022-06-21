import { useContext } from "react";
import { Context } from "../Context";
import { Comment } from "./Comment";

export const Comments = () => {
  const ctx = useContext(Context);

  return (
    <div id="comments">
      {ctx.comments
        .filter((c) => c.parent_comment_id === null)
        .map((c) => (
          <Comment comment={c} key={c.id} />
        ))}
    </div>
  );
};
