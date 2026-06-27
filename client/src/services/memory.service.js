import api from "./api";

const getMemories = async () => {
  const response = await api.get("/memory");
  return response.data;
};

const getMemoryById = async (id) => {
  const response = await api.get(`/memory/${id}`);
  return response.data;
};

export default {
  getMemories,
  getMemoryById,
};