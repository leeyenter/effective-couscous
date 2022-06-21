import { useContext } from "react";
import { CommentInterface, Context } from "../Context";

export const Comment = (props: { comment: CommentInterface }) => {
  const ctx = useContext(Context);
  const { id, comment, user, createdPretty } = props.comment;
  const userObj = ctx.users.find((u) => u.id === user);

  if (!userObj) return <></>;

  const pic = userObj.pic;

  return (
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
  );
};

const CommentBtns = (props: { comment: CommentInterface }) => {
  const btns: JSX.Element[] = [];
  const ctx = useContext(Context);

  if (props.comment.upvotes.map((x) => x.user).includes(ctx.user.id)) {
    btns.push(
      <button onClick={() => ctx.removeUpvote(props.comment.id)}>
        Upvoted! ({props.comment.upvotes.length})
      </button>
    );
  } else {
    btns.push(
      <button onClick={() => ctx.addUpvote(props.comment.id)}>
        ▲ Upvote ({props.comment.upvotes.length})
      </button>
    );
  }

  btns.push(<button>Reply</button>);

  //   <div className="comment-btns">
  //     {/*
  // var upvotes = upvotes.map((x) => x.user);

  // if (upvotes.includes(userId)) {
  // // Allow user to remove upvote
  // html += `<button onclick="fetch('DELETE', '/upvote/${id}', fetchComments)">Upvoted!</button>`;
  // } else {
  // // Allow user to add upvote
  // html += `<button onclick="fetch('PUT', '/upvote/${id}', fetchComments)">▲ Upvote</button>`;
  // } */}
  //   </div>;

  return <div className="comment-btns">{btns}</div>;
};
