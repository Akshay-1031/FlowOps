const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const aiRoutes = require("./routes/aiRoutes");
const helmet = require("helmet");

const app = express();
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects", taskRoutes);
app.use("/api/ai", aiRoutes);

console.log("=== FLOWOPS ROUTES REGISTERED ===");
console.log("Health: /api/health");
console.log("Auth: /api/auth/*");
console.log("Projects: /api/projects/*");
console.log("AI: /api/ai/*");

app.get("/api/debug", (req, res) => {
  res.json({
    status: "ok",
    message: "Express routes are reachable",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);

  res.status(500).json({
    message: "Internal server error",
  });
});

module.exports = app;