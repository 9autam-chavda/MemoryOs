const express = require("express");
const cors = require("cors");
const authRoutes = require(
  "./routes/auth.routes"
);
const userRoutes =
  require("./routes/user.routes");

const memoryRoutes =
  require(
    "./routes/memory.routes"
  );
const sharedRoutes = require("./routes/shared.routes");
const assistantRoutes = require("./routes/assistant.routes");

const memorySessionRoutes = require("./routes/memorySession.routes");

const errorHandler = require("./middleware/error.middleware");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MemoryOS API Running"
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/user",
  userRoutes
);

app.use(errorHandler);

app.use(
  "/api/memory",
  memoryRoutes
);

app.use(
  "/api/shared",
  sharedRoutes
);

app.use(
  "/api/assistant",
  assistantRoutes
);

app.use(
  "/api/memory-sessions",
   memorySessionRoutes
);

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  const isUploadError = error.name === "MulterError" || error.message === "Unsupported file type";
  res.status(isUploadError ? 400 : error.status || 500).json({
    success: false,
    message: isUploadError ? error.message : "An unexpected server error occurred",
  });
});

module.exports = app;
