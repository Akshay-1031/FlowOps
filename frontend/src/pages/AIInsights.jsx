import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock3,
  FolderKanban,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";
import { motion } from "motion/react";

import { getProjects } from "../services/projectService";
import { analyzeProject } from "../services/aiService";

function AIInsights() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] =
    useState("");

  const [analysis, setAnalysis] = useState(null);

  const [loadingProjects, setLoadingProjects] =
    useState(true);

  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingProjects(true);

        const response = await getProjects();

        const loadedProjects = response.projects || [];

        setProjects(loadedProjects);

        if (loadedProjects.length > 0) {
          setSelectedProject(
            String(loadedProjects[0].id)
          );
        }
      } catch (err) {
        console.error(
          "AI project loading error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load projects."
        );
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedProject) {
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setAnalysis(null);

      const response = await analyzeProject(
        selectedProject
      );

      setAnalysis(response);
    } catch (err) {
      console.error("AI analysis error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to analyze this project."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const selectedProjectData = projects.find(
    (project) =>
      String(project.id) === String(selectedProject)
  );

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <Sparkles size={21} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Intelligence
            </p>

            <h1 className="text-3xl font-bold tracking-tight">
              AI Insights
            </h1>
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Let FlowOps analyze your project's tasks and
          identify what deserves your attention next.
        </p>
      </div>

      {/* Project selector */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

          <div className="flex-1">
            <label
              htmlFor="ai-project"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Select project
            </label>

            <select
              id="ai-project"
              value={selectedProject}
              onChange={(event) => {
                setSelectedProject(event.target.value);
                setAnalysis(null);
                setError("");
              }}
              disabled={
                loadingProjects ||
                projects.length === 0
              }
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-white/30"
            >
              {projects.length === 0 ? (
                <option value="">
                  No projects available
                </option>
              ) : (
                projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={
              analyzing ||
              loadingProjects ||
              !selectedProject
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <RefreshCw
                  size={16}
                  className="animate-spin"
                />
                Analyzing...
              </>
            ) : (
              <>
                <Brain size={17} />
                Analyze Project
              </>
            )}
          </button>

        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!analysis && !analyzing && !error && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.025] px-6 py-16 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
            <Brain size={25} />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            Ready to analyze your work
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Select a project above and FlowOps will
            analyze its tasks, priorities, and progress.
          </p>

        </div>
      )}

      {/* Loading state */}
      {analyzing && (
        <div className="grid gap-5 lg:grid-cols-2">

          <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />

          <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />

          <div className="h-52 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />

          <div className="h-52 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />

        </div>
      )}

      {/* Analysis */}
      {analysis && !analyzing && (
        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="space-y-5"
        >

          {/* Project summary */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <FolderKanban size={20} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-600">
                  Project analysis
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {selectedProjectData?.name ||
                    analysis.project?.name}
                </h2>

                <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
                  {analysis.analysis?.summary}
                </p>
              </div>

            </div>

          </div>

          {/* Priorities */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Target size={17} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Recommended priorities
                </h2>

                <p className="text-xs text-slate-600">
                  What deserves your attention
                </p>
              </div>

            </div>

            <div className="mt-5 space-y-3">

              {analysis.analysis?.priorities
                ?.length > 0 ? (
                analysis.analysis.priorities.map(
                  (item, index) => (
                    <motion.div
                      key={`${item.task}-${index}`}
                      initial={{
                        opacity: 0,
                        x: -8,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                      className="rounded-xl border border-white/10 bg-white/[0.025] p-4"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">

                          <p className="text-sm font-medium">
                            {item.task}
                          </p>

                          <p className="mt-2 text-xs leading-5 text-slate-500">
                            {item.reason}
                          </p>

                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            item.urgency === "HIGH"
                              ? "bg-red-400/10 text-red-300"
                              : item.urgency ===
                                "MEDIUM"
                              ? "bg-yellow-400/10 text-yellow-300"
                              : "bg-slate-400/10 text-slate-400"
                          }`}
                        >
                          {item.urgency}
                        </span>

                      </div>

                    </motion.div>
                  )
                )
              ) : (
                <p className="text-sm text-slate-600">
                  No priority recommendations.
                </p>
              )}

            </div>
          </div>

          {/* Bottom cards */}
          <div className="grid gap-5 lg:grid-cols-2">

            {/* Bottlenecks */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <AlertTriangle size={17} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Potential bottlenecks
                  </h2>

                  <p className="text-xs text-slate-600">
                    Things that could slow progress
                  </p>
                </div>

              </div>

              <div className="mt-5 space-y-3">

                {analysis.analysis?.bottlenecks
                  ?.length > 0 ? (
                  analysis.analysis.bottlenecks.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-xl bg-white/[0.025] p-4"
                      >
                        <AlertTriangle
                          size={15}
                          className="mt-0.5 shrink-0 text-slate-500"
                        />

                        <p className="text-sm leading-5 text-slate-400">
                          {item}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-slate-600">
                    No major bottlenecks identified.
                  </p>
                )}

              </div>
            </div>

            {/* Next actions */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <ArrowRight size={17} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Suggested next actions
                  </h2>

                  <p className="text-xs text-slate-600">
                    Practical steps to keep moving
                  </p>
                </div>

              </div>

              <div className="mt-5 space-y-3">

                {analysis.analysis?.nextActions
                  ?.length > 0 ? (
                  analysis.analysis.nextActions.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-xl bg-white/[0.025] p-4"
                      >
                        <CheckCircle2
                          size={15}
                          className="mt-0.5 shrink-0 text-slate-500"
                        />

                        <p className="text-sm leading-5 text-slate-400">
                          {item}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-slate-600">
                    No next actions suggested.
                  </p>
                )}

              </div>
            </div>

          </div>

          {/* Refresh */}
          <div className="flex justify-end">

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex items-center gap-2 text-xs text-slate-500 transition hover:text-white"
            >
              <RefreshCw size={13} />
              Re-analyze project
            </button>

          </div>

        </motion.div>
      )}

    </div>
  );
}

export default AIInsights;