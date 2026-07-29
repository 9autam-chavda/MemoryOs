const axios = require("axios");

const AI_SERVICE_URL =
  process.env.AI_BASE_URL || "http://127.0.0.1:8000";

const REQUEST_TIMEOUT = Number(
  process.env.LLM_TIMEOUT || 60000
);

const debug = (...details) => {
  if (process.env.RAG_DEBUG === "true") {
    console.info("[Response Generator]", ...details);
  }
};

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

    debug("Sending prompt to AI service...");

        try {
      const { data } = await this.client.post(
        "/assistant",
        {
          prompt,
        }
      );

      if (!data) {
        throw new Error("Empty response.");
      }

      if (!data.answer) {
        throw new Error(
          "AI service returned no answer."
        );
      }

      debug("Response received.");

      return data.answer;
    } catch (error) {
      debug(error.message);

      throw new Error(
        "Unable to generate AI response."
      );
    }
  }
}

module.exports = new ResponseGenerator();
module.exports.ResponseGenerator = ResponseGenerator;