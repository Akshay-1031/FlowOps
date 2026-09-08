import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  Plus,
  Sparkles,
  Clock3,
} from "lucide-react";
import { motion } from "motion/react";

import { getProjects } from "../services/projectService";
import { getTasks } from "../services/taskService";

function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const projectResponse = await getProjects();
      const loadedProjects = projectResponse.projects || [];

      setProjects(loadedProjects);

      const allTasks = [];

      await Promise.all(
        loadedProjects.map(async (project) => {
          try {
            const taskResponse = await getTasks(project.id);

            const projectTasks = (taskResponse.tasks || []).map(
              (task) => ({
                ...task,
                projectName: project.name,
              })
            );

            allTasks.push(...projectTasks);
          } catch (error) {
            console.error(
              `Failed to load tasks for project ${project.id}:`,
              error
            );
          }
        })
      );

      setTasks(allTasks);
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const completed = tasks.filter(
      (task) => task.status === "DONE"
    ).length;

    const active = tasks.filter(
      (task) => task.status !== "DONE"
    ).length;

    return {
      projects: projects.length,
      activeTasks: active,
      completedTasks: completed,
    };
  }, [projects, tasks]);

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 5);
  }, [tasks]);

  const getStatusLabel = (status) => {
    if (status === "IN_PROGRESS") {
      return "In Progress";
    }

    if (status === "DONE") {
      return "Done";
    }

    return "Todo";
  };

  const getStatusClass = (status) => {
    if (status === "DONE") {
      return "bg-emerald-400/10 text-emerald-300";
    }

    if (status === "IN_PROGRESS") {
      return "bg-blue-400/10 text-blue-300";
    }

    return "bg-yellow-400/10 text-yellow-300";
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">
            Monday, September 8
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Good morning, Akshay
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Here's what's happening with your work.
          </p>
        </div>

        <button
          onClick={() => navigate("/projects")}
          className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          <Plus size={17} />
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Total Projects
            </span>

            <FolderKanban
              size={18}
              className="text-slate-500"
            />
          </div>

          <p className="mt-4 text-3xl font-bold">
            {loading ? "—" : stats.projects}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Active workspaces
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Active Tasks
            </span>

            <Clock3
              size={18}
              className="text-slate-500"
            />
          </div>

          <p className="mt-4 text-3xl font-bold">
            {loading ? "—" : stats.activeTasks}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Tasks still in progress
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Completed
            </span>

            <CheckCircle2
              size={18}
              className="text-slate-500"
            />
          </div>

          <p className="mt-4 text-3xl font-bold">
            {loading ? "—" : stats.completedTasks}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Finished tasks
          </p>
        </motion.div>

      </div>

      {/* Main grid */}
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">

        {/* Recent tasks */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                Recent Tasks
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                Your latest work across projects.
              </p>
            </div>

            <button
              onClick={() => navigate("/tasks")}
              className="flex items-center gap-1 text-xs text-slate-500 transition hover:text-white"
            >
              View all
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="mt-5 space-y-2">

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-16 animate-pulse rounded-xl bg-white/5"
                  />
                ))}
              </div>
            ) : recentTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                <p className="text-sm text-slate-500">
                  No tasks yet.
                </p>

                <button
                  onClick={() => navigate("/projects")}
                  className="mt-3 text-xs text-slate-300 hover:text-white"
                >
                  Create your first task →
                </button>
              </div>
            ) : (
              recentTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() =>
                    navigate(
                      `/projects/${task.projectId}`
                    )
                  }
                  className="flex w-full items-center justify-between gap-4 rounded-xl border border-transparent bg-white/[0.025] p-4 text-left transition hover:border-white/10 hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {task.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-600">
                      {task.projectName}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${getStatusClass(
                      task.status
                    )}`}
                  >
                    {getStatusLabel(task.status)}
                  </span>
                </button>
              ))
            )}

          </div>
        </div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/[0.04] blur-3xl" />

          <div className="relative">

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Sparkles size={17} />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  AI Insights
                </p>

                <p className="text-xs text-slate-600">
                  Powered by your workspace
                </p>
              </div>
            </div>

            <h3 className="mt-7 text-lg font-semibold leading-7">
              {stats.activeTasks > 0
                ? `You have ${stats.activeTasks} active ${
                    stats.activeTasks === 1
                      ? "task"
                      : "tasks"
                  } to focus on.`
                : "Your workspace is clear."}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              FlowOps will soon analyze your tasks,
              priorities, and project activity to
              recommend what you should focus on next.
            </p>

            <button
              onClick={() => navigate("/ai")}
              className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Explore AI Insights
              <ArrowRight size={15} />
            </button>

          </div>
        </motion.div>

      </div>

    </div>
  );
}

export default Dashboard;