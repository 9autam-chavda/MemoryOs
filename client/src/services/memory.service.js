import axios from "axios";
import api from "./api";
import { getToken } from "../utils/token";

const getMemories = async (fileType = "all", options = {}) => {
  const response = await api.get("/memory", {
    params: {
      fileType,
      ...(options.limit ? { limit: options.limit } : {}),
    },
  });

  return response.data;
};

const getMemoryById = async (id) => {
  const response = await api.get(`/memory/${id}`);
  return response.data;
};

const getRelatedMemories = async (id) => {
  const response = await api.get(`/memory/${id}/related`);
  return response.data;
};

const deleteMemory = async (id) => {
  const response = await api.delete(`/memory/${id}`);
  return response.data;
};

const uploadMemory = async (formData, onProgress, signal) => {
  const response = await axios({
    method: "post",
    url: "http://localhost:5000/api/memory/upload",
    data: formData,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    signal,

    onUploadProgress: (event) => {
      if (!event.total) return;

      const progress = Math.min(95, Math.round((event.loaded * 95) / event.total));

      onProgress?.(progress);
    },
  });

  return response.data;
};

const getUploadStatus = async (jobId, signal) => {
  const response = await api.get(`/memory/upload-status/${jobId}`, { signal });
  return response.data;
};

const searchMemories = async (query, fileType = "all") => {
  const response = await api.get("/memory/search", {
    params: {
      q: query,
      fileType,
    },
  });

  return response.data;
};

const toggleFavorite = async (id) => {
  const response = await api.patch(`/memory/${id}/favorite`);
  return response.data;
};

const createShare = async (id) => {
  const response = await api.post(`/memory/${id}/share`);
  return response.data;
};

const disableShare = async (id) => {
  const response = await api.delete(`/memory/${id}/share`);
  return response.data;
};

const getSharedPublic = async (token) => {
  const response = await api.get(`/shared/${token}`);
  return response.data;
};

export default {
  getMemories,
  getMemoryById,
  getRelatedMemories,
  deleteMemory,
  uploadMemory,
  getUploadStatus,
  searchMemories,
  toggleFavorite,
  createShare,
  disableShare,
  getSharedPublic,
};
