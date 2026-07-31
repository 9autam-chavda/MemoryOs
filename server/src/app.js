const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const memoryRoutes = require("./routes/memory.routes");
const sharedRoutes = require("./routes/shared.routes");
const assistantRoutes = require("./routes/assistant.routes");
const memorySessionRoutes = require("./routes/memorySession.routes");

const errorHandler = require("./middleware/error.middleware");

const app = express();

// ===========================================
// CORS
// ===========================================

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

// ===========================================
// Middlewares
// ===========================================

app.use(express.json());

// ===========================================
// Health Check
// ===========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MemoryOS API Running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ===========================================
// Routes
// ===========================================

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/memory", memoryRoutes);
app.use("/api/shared", sharedRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/memory-sessions", memorySessionRoutes);

// ===========================================
// 404 Handler
// ===========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ===========================================
// Global Error Handler (Always Last)
// ===========================================

app.use(errorHandler);

module.exports = app;