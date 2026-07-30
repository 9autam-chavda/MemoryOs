const handleAIError = (error, operation = "process the request") => {
  const message =
    error.response?.data?.detail ||
    error.response?.data?.message ||
    error.message ||
    "";

  const lower = message.toLowerCase();

  // Quota exceeded / Rate limit
  if (
    lower.includes("quota") ||
    lower.includes("resource_exhausted") ||
    lower.includes("rate limit") ||
    lower.includes("429")
  ) {
    throw new Error(
      "AI request limit reached. Please try again later."
    );
  }


  // Context window exceeded
if (
  lower.includes("token") ||
  lower.includes("context") ||
  lower.includes("maximum context") ||
  lower.includes("context length") ||
  lower.includes("input too large")
) {
  throw new Error(
    "The request is too large for the AI assistant. Please ask a more specific question."
  );
}

  // Timeout
  if (
    error.code === "ECONNABORTED" ||
    lower.includes("timeout")
  ) {
    throw new Error(
      "AI service timed out. Please try again."
    );
  }

  // AI service unavailable
  if (
    error.code === "ECONNREFUSED" ||
    error.code === "ENOTFOUND"
  ) {
    throw new Error(
      "AI service is currently unavailable."
    );
  }

  // Authentication / API key
  if (
    lower.includes("api key") ||
    lower.includes("authentication") ||
    lower.includes("permission denied") ||
    lower.includes("unauthorized") ||
    lower.includes("401")
  ) {
    throw new Error(
      "AI service authentication failed."
    );
  }

  // Invalid request
  if (
    lower.includes("invalid") ||
    lower.includes("bad request") ||
    lower.includes("400")
  ) {
    throw new Error(
      "The AI service could not process this request."
    );
  }

  // Generic
  throw new Error(
    `Unable to ${operation}. Please try again later.`
  );
};

module.exports = handleAIError;