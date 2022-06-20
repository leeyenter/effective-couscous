import { useEffect, useState } from "react";
import { API } from "./API";
import "./App.scss";
import { MainContainer } from "./components/MainContainer";
import {
  CommentInterface,
  Context,
  defaultUser,
  UserInterface,
} from "./Context";

const App = () => {
  const [users, setUsers] = useState<UserInterface[]>([defaultUser]);
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
    setUser(users[userId]);
  }, [userId, users]);

  const fetchComments = () => {
    API.fetchComments(user.id).then((data) => setComments(data));
  };

  const addUpvote = (commentId: number) => {
    API.addUpvote(user.id, commentId); //.then(fetchComments);
  };

  const removeUpvote = (commentId: number) => {
    API.removeUpvote(user.id, commentId); //.then(fetchComments);
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
      setUsers(data);
      setUserId(data[0].id);
    });

    const sse = new EventSource("/api/v2/updates");
    sse.addEventListener("comment", commentListener);
    sse.addEventListener("upvote", upvoteListener);
  }, []);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
