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
    console.log(user.id);
    API.addUpvote(user.id, commentId).then(fetchComments);
  };

  const removeUpvote = (commentId: number) => {
    API.removeUpvote(user.id, commentId).then(fetchComments);
  };

  useEffect(() => {
    API.fetchUsers().then((data) => {
      setUsers(data);
      setUserId(data[0].id);
    });
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
