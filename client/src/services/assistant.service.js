import api from "./api";

const askAssistant = async (question) => {
  const response = await api.post("/assistant/ask", { question });
  return response.data;
};

export default { askAssistant };
