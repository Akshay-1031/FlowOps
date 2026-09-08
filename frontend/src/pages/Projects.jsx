import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  Plus,
  Trash2,
  ArrowRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import {
  getProjects,
  createProject,
  deleteProject,
} from "../services/projectService";

import { getTasks } from "../services/taskService";

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
  });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProjects();
      const loadedProjects = response.projects || [];

      setProjects(loadedProjects);

      const counts = {};

      await Promise.all(
        loadedProjects.map(async (project) => {
          try {
            const taskResponse = await getTasks(project.id);

            counts[project.id] =
              taskResponse.tasks?.length || 0;
          } catch (err) {
            console.error(
              `Failed to load tasks for project ${project.id}:`,
              err
            );

            counts[project.id] = 0;
          }
        })
      );

      setTaskCounts(counts);
    } catch (err) {
      console.error("Projects loading error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (event) => {
    event.preventDefault();

    if (!projectForm.name.trim()) {
      return;
    }

    try {
      setCreating(true);
      setError("");

      await createProject({
        name: projectForm.name.trim(),
        description:
          projectForm.description.trim() || undefined,
      });

      setProjectForm({
        name: "",
        description: "",
      });

      setShowCreateModal(false);

      await loadProjects();
    } catch (err) {
      console.error("Project creation error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to create project."
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setError("");

      await deleteProject(deleteTarget.id);

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) => project.id !== deleteTarget.id
        )
      );

      setDeleteTarget(null);
    } catch (err) {
      console.error("Project deletion error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete project."
      );
    } finally {
      setDeleting(false);
    }
  };

  const openProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-40 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-white/5" />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">
            Workspace
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Projects
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Organize your work and keep everything moving.
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setShowCreateModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          <Plus size={17} />
          New Project
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Empty state */}
      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.025] px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
            <FolderKanban size={24} />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            No projects yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Create your first project to start managing
            tasks, priorities, and AI-powered insights.
          </p>

          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Create your first project
          </button>
        </div>
      ) : (
        /* Project cards */
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.055]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <FolderKanban size={20} />
                </div>

                <button
                  onClick={() => setDeleteTarget(project)}
                  className="rounded-lg p-2 text-slate-700 opacity-0 transition hover:bg-red-400/10 hover:text-red-400 group-hover:opacity-100"
                  title="Delete project"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                {project.name}
              </h2>

              <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                {project.description ||
                  "No description added yet."}
              </p>

              <div className="mt-5 flex items-center gap-2">
                <span className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-500">
                  {taskCounts[project.id] || 0} tasks
                </span>

                <span className="rounded-lg bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                  Active
                </span>
              </div>

              {/* THIS is the important part */}
              <button
                type="button"
                onClick={() => openProject(project.id)}
                className="mt-6 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white hover:text-slate-950"
              >
                <span>Open Project</span>
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
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
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 10,
              }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Create project
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Start a new workspace.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowCreateModal(false)
                  }
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleCreateProject}
                className="mt-6 space-y-5"
              >
                <div>
                  <label
                    htmlFor="project-name"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Project name
                  </label>

                  <input
                    id="project-name"
                    value={projectForm.name}
                    onChange={(event) =>
                      setProjectForm({
                        ...projectForm,
                        name: event.target.value,
                      })
                    }
                    placeholder="e.g. FlowOps"
                    required
                    autoFocus
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-white/30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="project-description"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Description
                  </label>

                  <textarea
                    id="project-description"
                    value={projectForm.description}
                    onChange={(event) =>
                      setProjectForm({
                        ...projectForm,
                        description:
                          event.target.value,
                      })
                    }
                    placeholder="What is this project about?"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-white/30"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setShowCreateModal(false)
                    }
                    className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="flex flex-1 items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {creating
                      ? "Creating..."
                      : "Create project"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
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
                Delete project?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This will permanently delete{" "}
                <span className="font-medium text-slate-300">
                  {deleteTarget.name}
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
                  onClick={handleDeleteProject}
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

export default Projects;