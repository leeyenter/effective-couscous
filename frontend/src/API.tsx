import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";
export const API_URL = BASE_URL + "/api/v2";

const buildHeaders = (userId: number) => {
  return { headers: { Authorization: `Bearer ${userId}` } };
};

export const API = {
  fetchUsers: async () => {
    const resp = await axios.get(`${API_URL}/users`);
    return resp.data;
  },

  fetchComments: async (userId: number) => {
    const resp = await axios.get(`${API_URL}/comments`, buildHeaders(userId));
    return resp.data;
  },

  submitComment: async (userId: number, comment: string, parentId?: number) => {
    const resp = await axios.post(
      `${API_URL}/comments`,
      { comment: comment, parent_comment_id: parentId },
      buildHeaders(userId)
    );
    return resp.data;
  },

  addUpvote: async (userId: number, commentId: number) => {
    const resp = await axios.put(
      `${API_URL}/upvote/${commentId}`,
      {},
      buildHeaders(userId)
    );
    return resp.data;
  },

  removeUpvote: async (userId: number, commentId: number) => {
    const resp = await axios.delete(
      `${API_URL}/upvote/${commentId}`,
      buildHeaders(userId)
    );
    return resp.data;
  },
};
