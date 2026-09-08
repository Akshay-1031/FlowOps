const express = require("express");
const rateLimit = require("express-rate-limit");

const { register, login } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many authentication requests. Please try again later.",
  },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

router.get("/me", authenticateToken, (req, res) => {
  res.json({
    user: req.user,
  });
});

module.exports = router;