import axios from "axios";

const API_URL = "/api/v1";

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

  submitComment: async (userId: number, comment: string) => {
    const resp = await axios.post(
      `${API_URL}/comments`,
      { comment: comment },
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
