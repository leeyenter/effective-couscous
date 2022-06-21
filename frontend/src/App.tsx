import { useCallback, useEffect, useState } from "react";
import { API, API_URL } from "./API";
import "./App.scss";
import { MainContainer } from "./components/MainContainer";
import {
  CommentInterface,
  Context,
  defaultUser,
  UserInterface,
} from "./Context";

const App = () => {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [comments, setComments] = useState<CommentInterface[]>([]);
  const [userId, setUserId] = useState(0);
  const [user, setUser] = useState(defaultUser);

  const changeUser = () => {
    if (userId === users.length - 1) {
      setUserId(0);
    } else {
      setUserId((id) => id + 1);
    }
  };

  useEffect(() => {
    if (userId < users.length) setUser(users[userId]);
  }, [userId, users]);

  const fetchComments = useCallback(() => {
    if (user.id > 0)
      API.fetchComments(user.id).then((data) => setComments(data));
  }, [user]);

  const addUpvote = (commentId: number) => {
    if (user.id > 0) API.addUpvote(user.id, commentId);
  };

  const removeUpvote = (commentId: number) => {
    if (user.id > 0) API.removeUpvote(user.id, commentId);
  };

  const commentListener = (data: MessageEvent) => {
    const json = JSON.parse(data.data);
    json["createdPretty"] = "1 second ago";
    json["upvotes"] = [];

    setComments((oldComments) => {
      const newComments = oldComments.slice();
      newComments.unshift(json);
      console.log(newComments);
      return newComments;
    });
  };

  const upvoteListener = (data: MessageEvent) => {
    const json = JSON.parse(data.data);
    setComments((oldComments) => {
      const idx = oldComments.findIndex((x) => x.id === parseInt(json.comment));
      const newComments = oldComments.slice();
      const comment = { ...oldComments[idx] };

      // Remove all existing ones first; just in case there's any duplicates
      comment.upvotes = comment.upvotes.filter(
        (x) => x.user !== parseInt(json.user)
      );

      if (json.add) {
        comment.upvotes.push({
          id: 0,
          comment: json.id,
          user: parseInt(json.user),
        });
      }
      newComments[idx] = comment;
      return newComments;
    });
  };

  useEffect(() => {
    API.fetchUsers().then((data) => {
      console.log("users", data);
      setUsers(data);
    });

    const sse = new EventSource(`${API_URL}/updates`);
    sse.addEventListener("comment", commentListener);
    sse.addEventListener("upvote", upvoteListener);
  }, []);

  useEffect(() => {
    fetchComments();
  }, [user, fetchComments]);

  if (users.length === 0) return <div>Loading...</div>;

  return (
    <Context.Provider
      value={{
        user,
        users,
        changeUser,
        comments,
        fetchComments,
        addUpvote,
        removeUpvote,
      }}
    >
      <MainContainer />
    </Context.Provider>
  );
};

export default App;
