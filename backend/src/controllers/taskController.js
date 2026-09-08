const { db } = require("../prisma/db.ts");
const {
  sendTaskCompletedWebhook,
} = require("../services/webhookService");

async function createTask(req, res) {
  try {
    const {
      title,
      description,
      priority,
      assigneeId,
    } = req.body;

    const projectId = Number(req.params.projectId);
    const userId = req.user.userId;

    if (Number.isNaN(projectId)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const project =
      await db.orm.public.Project.where({
        id: projectId,
        ownerId: userId,
      }).first();

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const task = await db.orm.public.Task.create({
      title: title.trim(),
      description,
      priority: priority || "MEDIUM",
      projectId,
      assigneeId: assigneeId || null,
    });

    return res.status(201).json({
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      message: "Unable to create task",
    });
  }
}

async function getTasks(req, res) {
  try {
    const projectId = Number(req.params.projectId);
    const userId = req.user.userId;

    if (Number.isNaN(projectId)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project =
      await db.orm.public.Project.where({
        id: projectId,
        ownerId: userId,
      }).first();

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const tasks =
      await db.orm.public.Task.where({
        projectId,
      }).all();

    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      message: "Unable to fetch tasks",
    });
  }
}

async function getTask(req, res) {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.userId;

    if (Number.isNaN(taskId)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task =
      await db.orm.public.Task.where({
        id: taskId,
      }).first();

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project =
      await db.orm.public.Project.where({
        id: task.projectId,
        ownerId: userId,
      }).first();

    if (!project) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      task,
    });
  } catch (error) {
    console.error("Get task error:", error);

    return res.status(500).json({
      message: "Unable to fetch task",
    });
  }
}

async function updateTask(req, res) {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.userId;

    const {
      title,
      description,
      status,
      priority,
      assigneeId,
    } = req.body;

    if (Number.isNaN(taskId)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task =
      await db.orm.public.Task.where({
        id: taskId,
      }).first();

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project =
      await db.orm.public.Project.where({
        id: task.projectId,
        ownerId: userId,
      }).first();

    if (!project) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const newStatus = status || task.status;

    const updatedTask =
      await db.orm.public.Task.where({
        id: taskId,
      }).update({
        title: title || task.title,

        description:
          description ?? task.description,

        status: newStatus,

        priority:
          priority || task.priority,

        assigneeId:
          assigneeId ?? task.assigneeId,
      });

    /*
     * Event-driven behavior:
     *
     * Only trigger the webhook when the task
     * transitions from a non-DONE state to DONE.
     */
    const taskWasJustCompleted =
      task.status !== "DONE" &&
      newStatus === "DONE";

    if (taskWasJustCompleted) {
      console.log(
        `Task ${updatedTask.id} completed. Triggering webhook...`
      );

      /*
       * We intentionally don't await this.
       *
       * The user's task update should succeed even
       * if the external webhook is temporarily unavailable.
       */
      sendTaskCompletedWebhook(
        updatedTask,
        project
      ).catch((error) => {
        console.error(
          "Background webhook error:",
          error.message
        );
      });
    }

    return res.status(200).json({
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      message: "Unable to update task",
    });
  }
}

async function deleteTask(req, res) {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.userId;

    if (Number.isNaN(taskId)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task =
      await db.orm.public.Task.where({
        id: taskId,
      }).first();

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project =
      await db.orm.public.Project.where({
        id: task.projectId,
        ownerId: userId,
      }).first();

    if (!project) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await db.orm.public.Task.where({
      id: taskId,
    }).delete();

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      message: "Unable to delete task",
    });
  }
}

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};