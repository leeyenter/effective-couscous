import { AddCommentForm } from "./AddCommentForm";
import { Comments } from "./Comments";

export const MainContainer = () => {
  return (
    <div id="main-container">
      <div id="main">
        <h1>Discussion</h1>
        <AddCommentForm />
        <hr />
        <Comments />
      </div>
    </div>
  );
};
