const assistantService = require("../services/assistant.service");

const debug = (...details) => {
  if (process.env.RAG_DEBUG === "true") {
    console.info("[Assistant Controller]", ...details);
  }
};

const askAssistant = async (req, res) => {
  try {
    const { question, sessionId } = req.body;
    const userId = req.user?.id;

    debug("REQUEST", {
      userId,
      sessionId,
      questionLength: question?.length || 0,
    });

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required.",
      });
    }

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

    const result = await assistantService.process({
      sessionId,
      question: question.trim(),
      userId,
    });

    debug("SUCCESS", {
      retrievedMemories:
        result.metadata?.retrievedMemories || 0,
      answerLength: result.answer?.length || 0,
      responseTime:
        result.metadata?.responseTime || 0,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("[Assistant Controller]", error);

    debug("ERROR", {
      message: error.message,
      status: error.status || 500,
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