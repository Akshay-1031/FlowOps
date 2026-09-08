const express = require("express");

const {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
} = require("../controllers/taskController");

const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/:projectId/tasks",
    authenticateToken,
    createTask
);

router.get(
    "/:projectId/tasks",
    authenticateToken,
    getTasks
);

router.get(
    "/tasks/:id",
    authenticateToken,
    getTask
);

router.put(
    "/tasks/:id",
    authenticateToken,
    updateTask
);

router.delete(
    "/tasks/:id",
    authenticateToken,
    deleteTask
);

module.exports = router;