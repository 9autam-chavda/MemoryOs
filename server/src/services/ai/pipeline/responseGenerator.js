const axios = require("axios");

const AI_SERVICE_URL = (
  process.env.AI_SERVICE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

const REQUEST_TIMEOUT = Number(
  process.env.LLM_TIMEOUT || 60000
);

class ResponseGenerator {
  constructor() {
    this.client = axios.create({
      baseURL: AI_SERVICE_URL,
      timeout: REQUEST_TIMEOUT,
    });
  }

  async generate(prompt) {
    if (!prompt) {
      throw new Error("Prompt is required.");
    }

    console.log("\n==============================");
    console.log("ResponseGenerator");
    console.log("==============================");
    console.log("AI URL:", AI_SERVICE_URL);
    console.log("Endpoint:", "/assistant");
    console.log("Prompt Length:", prompt.length);

    try {
      const response = await this.client.post(
        "/assistant",
        { prompt }
      );

      console.log("Status:", response.status);
      console.log("Data:", response.data);

      if (!response.data.answer) {
        throw new Error("No answer returned.");
      }

      return response.data.answer;

    } catch (error) {

      console.log("\n========= AXIOS ERROR =========");

      console.log("Code:", error.code);
      console.log("Message:", error.message);
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);

      console.log("===============================\n");

      throw error;
    }
  }
}

module.exports = new ResponseGenerator();
module.exports.ResponseGenerator = ResponseGenerator;