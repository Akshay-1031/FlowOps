import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { getProject } from "../services/projectService";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/taskService";

function ProjectWorkspace() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
  });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadWorkspace = async () => {
    try {
      setLoading(true);
      setError("");

      const [projectResponse, taskResponse] = await Promise.all([
        getProject(projectId),
        getTasks(projectId),
      ]);

      setProject(projectResponse.project);
      setTasks(taskResponse.tasks || []);
    } catch (err) {
      console.error("Workspace loading error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load this project."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, [projectId]);

  const groupedTasks = useMemo(() => {
    return {
      TODO: tasks.filter((task) => task.status === "TODO"),
      IN_PROGRESS: tasks.filter(
        (task) => task.status === "IN_PROGRESS"
      ),
      DONE: tasks.filter((task) => task.status === "DONE"),
    };
  }, [tasks]);

  const handleCreateTask = async (event) => {
    event.preventDefault();

    if (!taskForm.title.trim()) {
      return;
    }

    try {
      setCreating(true);
      setError("");

      await createTask(projectId, {
        title: taskForm.title.trim(),
        description:
          taskForm.description.trim() || undefined,
        priority: taskForm.priority,
      });

      setTaskForm({
        title: "",
        description: "",
        priority: "MEDIUM",
      });

      setShowCreateModal(false);

      await loadWorkspace();
    } catch (err) {
      console.error("Task creation error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to create task."
      );
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (task, status) => {
    try {
      setError("");

      await updateTask(task.id, {
        status,
      });

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === task.id
            ? { ...item, status }
            : item
        )
      );
    } catch (err) {
      console.error("Task update error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update task."
      );
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setError("");

      await deleteTask(deleteTarget.id);

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== deleteTarget.id
        )
      );

      setDeleteTarget(null);
    } catch (err) {
      console.error("Task deletion error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete task."
      );
    } finally {
      setDeleting(false);
    }
  };

  const formatStatus = (status) => {
    if (status === "IN_PROGRESS") {
      return "In Progress";
    }

    if (status === "DONE") {
      return "Done";
    }

    return "Todo";
  };

  const formatPriority = (priority) => {
    return (
      priority.charAt(0) +
      priority.slice(1).toLowerCase()
    );
  };

  const getPriorityClass = (priority) => {
    if (priority === "HIGH") {
      return "bg-red-400/10 text-red-300";
    }

    if (priority === "LOW") {
      return "bg-slate-400/10 text-slate-400";
    }

    return "bg-yellow-400/10 text-yellow-300";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded bg-white/10" />

        <div className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />

        <div className="grid gap-5 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
        <p className="text-slate-400">
          Project could not be found.
        </p>

        <button
          onClick={() => navigate("/projects")}
          className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Back */}
      <button
        onClick={() => navigate("/projects")}
        className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to Projects
      </button>

      {/* Project header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <FolderKanban size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {project.name}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {project.description ||
                  "No description added yet."}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setError("");
              setShowCreateModal(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            <Plus size={17} />
            New Task
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-400">
            <FolderKanban size={14} />
            {tasks.length} total tasks
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-400">
            <Clock3 size={14} />
            {groupedTasks.IN_PROGRESS.length} in progress
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-400">
            <CheckCircle2 size={14} />
            {groupedTasks.DONE.length} completed
          </div>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Task board */}
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          {
            key: "TODO",
            title: "Todo",
            description: "Up next",
          },
          {
            key: "IN_PROGRESS",
            title: "In Progress",
            description: "Currently working",
          },
          {
            key: "DONE",
            title: "Done",
            description: "Completed work",
          },
        ].map((column) => (
          <div
            key={column.key}
            className="min-h-[400px] rounded-2xl border border-white/10 bg-white/[0.025] p-4"
          >
            {/* Column header */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">
                  {column.title}
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  {column.description}
                </p>
              </div>

              <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-white/5 px-2 text-xs text-slate-500">
                {groupedTasks[column.key].length}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {groupedTasks[column.key].length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
                  <p className="text-xs text-slate-600">
                    No tasks here
                  </p>
                </div>
              ) : (
                groupedTasks[column.key].map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    className="group rounded-xl border border-white/10 bg-slate-900/70 p-4 transition hover:border-white/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-medium leading-5">
                        {task.title}
                      </h3>

                      <button
                        onClick={() => setDeleteTarget(task)}
                        className="shrink-0 text-slate-700 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                        title="Delete task"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {task.description && (
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-medium ${getPriorityClass(
                          task.priority
                        )}`}
                      >
                        {formatPriority(task.priority)}
                      </span>

                      <select
                        value={task.status}
                        onChange={(event) =>
                          handleStatusChange(
                            task,
                            event.target.value
                          )
                        }
                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] text-slate-400 outline-none"
                      >
                        <option value="TODO">
                          Todo
                        </option>

                        <option value="IN_PROGRESS">
                          In Progress
                        </option>

                        <option value="DONE">
                          Done
                        </option>
                      </select>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create task modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowCreateModal(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Create task
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add a task to this project.
                  </p>
                </div>

                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleCreateTask}
                className="mt-6 space-y-5"
              >
                <div>
                  <label
                    htmlFor="task-title"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Task title
                  </label>

                  <input
                    id="task-title"
                    value={taskForm.title}
                    onChange={(event) =>
                      setTaskForm({
                        ...taskForm,
                        title: event.target.value,
                      })
                    }
                    placeholder="e.g. Implement JWT middleware"
                    required
                    autoFocus
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-white/30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="task-description"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Description
                  </label>

                  <textarea
                    id="task-description"
                    value={taskForm.description}
                    onChange={(event) =>
                      setTaskForm({
                        ...taskForm,
                        description: event.target.value,
                      })
                    }
                    placeholder="What needs to be done?"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-white/30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="task-priority"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Priority
                  </label>

                  <select
                    id="task-priority"
                    value={taskForm.priority}
                    onChange={(event) =>
                      setTaskForm({
                        ...taskForm,
                        priority: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300 outline-none focus:border-white/30"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="flex flex-1 items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:opacity-60"
                  >
                    {creating ? "Creating..." : "Create task"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
                <Trash2 size={20} />
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                Delete task?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This will permanently delete{" "}
                <span className="font-medium text-slate-300">
                  {deleteTarget.title}
                </span>
                .
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteTask}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-red-500/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProjectWorkspace;