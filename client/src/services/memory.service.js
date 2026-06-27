import axios from "axios";
import api from "./api";
import { getToken } from "../utils/token";

const getMemories = async () => {
  const response = await api.get("/memory");
  return response.data;
};

const getMemoryById = async (id) => {
  const response = await api.get(`/memory/${id}`);
  return response.data;
};

const deleteMemory = async (id) => {
  const response = await api.delete(`/memory/${id}`);
  return response.data;
};

const uploadMemory = async (formData) => {
  const response = await axios({
    method: "post",
    url: "http://localhost:5000/api/memory/upload",
    data: formData,
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return response.data;
};

const searchMemories = async (query) => {
  const response = await api.get(
    `/memory/search?q=${encodeURIComponent(query)}`
  );

  return response.data;
};

export default {
  getMemories,
  getMemoryById,
  deleteMemory,
  uploadMemory,
  searchMemories,
};