const assistantService = require("../services/assistant.service");

const debug = (...details) => {
  if (process.env.RAG_DEBUG === "true") {
    console.info("[RAG Controller]", ...details);
  }
};

const askAssistant = async (req, res) => {
  try {
    const { question } = req.body;

    debug("INPUT", {
      userId: req.user?.id,
      questionLength: question?.length,
    });

    // -------------------------
    // Validation
    // -------------------------
    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const result = await assistantService.process(
      question.trim(),
      req.user.id
    );

    debug("OUTPUT", {
      sources: result.sources?.length,
      answerLength: result.answer?.length,
    });

    return res.status(200).json(result);

  } catch (error) {

    debug("ERROR", {
      message: error.message,
      status: error.status,
    });

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.status && error.status < 500
          ? error.message
          : "Assistant service is temporarily unavailable.",
    });
  }
};

module.exports = {
  askAssistant,
};