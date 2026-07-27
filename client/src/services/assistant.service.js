import api from "./api";

const askAssistant = async (sessionId, question) => {
  const response = await api.post("/assistant/ask", { sessionId, question });
  return response.data;
};

export default {
  askAssistant,
};
