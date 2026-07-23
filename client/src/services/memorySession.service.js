import api from "./api";

const createSession = async () => {
  const response = await api.post("/memory-sessions");
  return response.data.session;
};

const getSessions = async () => {
  const response = await api.get("/memory-sessions");
  return response.data.sessions;
};

const getSession = async (sessionId) => {
  const response = await api.get(`/memory-sessions/${sessionId}`);
  return response.data;
};

const renameSession = async (sessionId, title) => {
  const response = await api.patch(`/memory-sessions/${sessionId}`, {
    title,
  });

  return response.data.session;
};

const deleteSession = async (sessionId) => {
  await api.delete(`/memory-sessions/${sessionId}`);
};

export default {
  createSession,
  getSessions,
  getSession,
  renameSession,
  deleteSession,
};