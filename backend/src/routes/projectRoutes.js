const express = require("express");
const {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
} = require("../controllers/projectController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createProject);
router.get("/", authenticateToken, getProjects);
router.get("/:id", authenticateToken, getProject);
router.put("/:id", authenticateToken, updateProject);
router.delete("/:id", authenticateToken, deleteProject);


module.exports = router;