import { useContext, useState } from "react";
import { CommentInterface, Context } from "../Context";
import { AddCommentForm } from "./AddCommentForm";

export const Comment = (props: { comment: CommentInterface }) => {
  const ctx = useContext(Context);
  const { comment, user, createdPretty } = props.comment;
  const userObj = ctx.users.find((u) => u.id === user);

  if (!userObj) return <></>;

  const pic = userObj.pic;
  const childComments = ctx.comments.filter(
    (x) => x.parent_comment_id === props.comment.id
  );

  return (
    <div className={childComments.length > 0 ? "comment-thread" : ""}>
      <div className="comment">
        <img src={pic} alt="User profile" />
        <div className="comment-content">
          <div className="comment-header">
            <span className="comment-name">{userObj.name}</span>
            <span className="comment-date"> ・ {createdPretty}</span>
          </div>
          <div className="comment-text">{comment}</div>
          <CommentBtns comment={props.comment} />
        </div>
      </div>
      <div className="comment-children">
        {childComments.map((c) => (
          <Comment comment={c} key={c.id} />
        ))}
      </div>
    </div>
  );
};

const CommentBtns = (props: { comment: CommentInterface }) => {
  const btns: JSX.Element[] = [];
  const ctx = useContext(Context);
  const [showReplyBox, setShowReplyBox] = useState(false);

  if (props.comment.upvotes.map((x) => x.user).includes(ctx.user.id)) {
    btns.push(
      <button onClick={() => ctx.removeUpvote(props.comment.id)} key="upvote">
        Upvoted! ({props.comment.upvotes.length})
      </button>
    );
  } else {
    btns.push(
      <button onClick={() => ctx.addUpvote(props.comment.id)} key="upvote">
        ▲ Upvote ({props.comment.upvotes.length})
      </button>
    );
  }

  btns.push(
    <button onClick={() => setShowReplyBox((x) => !x)} key="reply">
      Reply
    </button>
  );

  return (
    <>
      <div className="comment-btns">{btns}</div>
      {showReplyBox && (
        <AddCommentForm
          parentId={props.comment.parent_comment_id || props.comment.id} // Set it so that we only have 1 layer of nesting
          callback={() => setShowReplyBox(false)}
        />
      )}
    </>
  );
};
