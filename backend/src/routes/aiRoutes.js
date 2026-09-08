const express = require("express");

const { authenticateToken } = require("../middleware/authMiddleware");
const { analyzeProject } = require("../controllers/aiController");

const router = express.Router();

router.post(
  "/projects/:projectId/analyze",
  authenticateToken,
  analyzeProject
);

module.exports = router;