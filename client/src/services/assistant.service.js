import api from "./api";

const askAssistant = async (sessionId, question) => {
  try {
    const response = await api.post("/assistant/ask", {
      sessionId,
      question,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  askAssistant,
};