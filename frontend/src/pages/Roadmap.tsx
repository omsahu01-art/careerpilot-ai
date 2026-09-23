import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";

type Gap = {
  skill: string;
  current: string;
  required: string;
  priority: "High" | "Medium";
  why: string;
  focus: string;
  estimatedTime: string;
};

type Role = {
  id: string;
  title: string;
};

type StoredGaps = {
  role: Role;
  gaps: Gap[];
  highPriorityCount: number;
  mediumPriorityCount: number;
};

type RoadmapModule = {
  id: string;
  skill: string;
  title: string;
  topics: string[];
  duration: string;
  priority: "High" | "Medium";
};

type RoadmapWeek = {
  week: number;
  title: string;
  modules: RoadmapModule[];
};

type StoredRoadmap = {
  role: Role;
  gaps: Gap[];
  weeks: RoadmapWeek[];
  totalModules: number;
  estimatedWeeks: number;
};

const moduleLibrary: Record<
  string,
  {
    title: string;
    topics: string[];
    duration: string;
  }
> = {
  Python: {
    title: "Python Foundations",
    topics: ["Syntax", "Functions", "Data structures", "File handling"],
    duration: "3-4 hours",
  },
  SQL: {
    title: "SQL for Data Work",
    topics: ["SELECT", "JOINs", "GROUP BY", "Subqueries"],
    duration: "3-4 hours",
  },
  Excel: {
    title: "Advanced Excel",
    topics: ["Formulas", "Lookups", "Pivot tables", "Data cleaning"],
    duration: "2-3 hours",
  },
  "Power BI": {
    title: "Power BI Fundamentals",
    topics: ["Data import", "Data modeling", "DAX basics", "Dashboards"],
    duration: "4-5 hours",
  },
  Pandas: {
    title: "Pandas for Data Analysis",
    topics: ["DataFrames", "Filtering", "Aggregation", "Data cleaning"],
    duration: "3-4 hours",
  },
  Statistics: {
    title: "Statistics Essentials",
    topics: ["Mean & variance", "Probability", "Distributions", "Hypothesis testing"],
    duration: "4-5 hours",
  },
  "Machine Learning": {
    title: "Machine Learning Foundations",
    topics: [
      "Supervised learning",
      "Model training",
      "Evaluation",
      "Feature engineering",
    ],
    duration: "5-6 hours",
  },
  "Scikit-learn": {
    title: "Scikit-learn Practice",
    topics: ["Preprocessing", "Pipelines", "Models", "Evaluation"],
    duration: "4-5 hours",
  },
  React: {
    title: "React Development",
    topics: ["Components", "Props", "State", "Hooks"],
    duration: "4-5 hours",
  },
  JavaScript: {
    title: "JavaScript Fundamentals",
    topics: ["ES6+", "Functions", "Arrays", "Async JavaScript"],
    duration: "4-5 hours",
  },
  HTML: {
    title: "HTML Fundamentals",
    topics: ["Semantic HTML", "Forms", "Accessibility", "Page structure"],
    duration: "2-3 hours",
  },
  CSS: {
    title: "Modern CSS",
    topics: ["Flexbox", "Grid", "Responsive design", "Layouts"],
    duration: "3-4 hours",
  },
  Git: {
    title: "Git & GitHub",
    topics: ["Commits", "Branches", "Merging", "Pull requests"],
    duration: "2-3 hours",
  },
  "REST APIs": {
    title: "REST API Fundamentals",
    topics: ["HTTP", "Endpoints", "JSON", "API integration"],
    duration: "3-4 hours",
  },
  "Node.js": {
    title: "Node.js Backend",
    topics: ["Runtime", "Express", "Routes", "Middleware"],
    duration: "4-5 hours",
  },
  Docker: {
    title: "Docker Fundamentals",
    topics: ["Images", "Containers", "Dockerfile", "Compose"],
    duration: "3-4 hours",
  },
  Linux: {
    title: "Linux Essentials",
    topics: ["Terminal", "Files", "Permissions", "Processes"],
    duration: "3-4 hours",
  },
  Kubernetes: {
    title: "Kubernetes Basics",
    topics: ["Pods", "Deployments", "Services", "Config"],
    duration: "4-5 hours",
  },
  AWS: {
    title: "AWS Cloud Fundamentals",
    topics: ["EC2", "S3", "IAM", "Cloud concepts"],
    duration: "4-5 hours",
  },
  "CI/CD": {
    title: "CI/CD Fundamentals",
    topics: ["Pipelines", "Builds", "Testing", "Deployment"],
    duration: "3-4 hours",
  },
  Figma: {
    title: "Figma Fundamentals",
    topics: ["Frames", "Components", "Auto layout", "Design systems"],
    duration: "3-4 hours",
  },
  "UI/UX": {
    title: "UI/UX Fundamentals",
    topics: ["User flows", "Information architecture", "UI principles"],
    duration: "4-5 hours",
  },
  "User Research": {
    title: "User Research",
    topics: ["Interviews", "Personas", "Usability testing", "Insights"],
    duration: "3-4 hours",
  },
  Wireframing: {
    title: "Wireframing",
    topics: ["Low fidelity", "Layouts", "User flows", "Iterations"],
    duration: "2-3 hours",
  },
  Prototyping: {
    title: "Interactive Prototyping",
    topics: ["Interactions", "Navigation", "States", "Testing"],
    duration: "3-4 hours",
  },
  Java: {
    title: "Java Fundamentals",
    topics: ["OOP", "Collections", "Exceptions", "Classes"],
    duration: "4-5 hours",
  },
  Kotlin: {
    title: "Kotlin Fundamentals",
    topics: ["Syntax", "Classes", "Collections", "Null safety"],
    duration: "4-5 hours",
  },
  Flutter: {
    title: "Flutter Development",
    topics: ["Widgets", "Layouts", "State", "Navigation"],
    duration: "5-6 hours",
  },
  "React Native": {
    title: "React Native",
    topics: ["Components", "Navigation", "State", "Native APIs"],
    duration: "5-6 hours",
  },
};

function normalizeProgress(
  saved: Record<string, boolean> | null,
  modules: RoadmapModule[],
) {
  if (!saved) {
    return {};
  }

  const validIds = new Set(modules.map((module) => module.id));

  return Object.fromEntries(
    Object.entries(saved).filter(([id]) => validIds.has(id)),
  );
}

export default function Roadmap() {
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState<StoredRoadmap | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const storedRoadmap = sessionStorage.getItem("careerpilot_roadmap");

      if (storedRoadmap) {
        const parsed: StoredRoadmap = JSON.parse(storedRoadmap);
        setRoadmap(parsed);

        const allModules = parsed.weeks.flatMap((week) => week.modules);
        const savedProgress = localStorage.getItem(
          "careerpilot_roadmap_progress",
        );

        setCompleted(
          normalizeProgress(
            savedProgress ? JSON.parse(savedProgress) : null,
            allModules,
          ),
        );

        setReady(true);
        return;
      }

      const storedGaps = sessionStorage.getItem("careerpilot_gaps");

      if (!storedGaps) {
        setReady(true);
        return;
      }

      const parsedGaps: StoredGaps = JSON.parse(storedGaps);

      const sortedGaps = [...parsedGaps.gaps].sort((a, b) => {
        if (a.priority === b.priority) {
          return 0;
        }

        return a.priority === "High" ? -1 : 1;
      });

      const generatedModules: RoadmapModule[] = sortedGaps.map(
        (gap, index) => {
          const library = moduleLibrary[gap.skill];

          return {
            id: `${gap.skill.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
            skill: gap.skill,
            title: library?.title || `Learn ${gap.skill}`,
            topics:
              library?.topics || [
                `Understand ${gap.skill} fundamentals`,
                `Practice ${gap.skill}`,
                `Build a small exercise`,
                `Apply ${gap.skill} in a project`,
              ],
            duration: library?.duration || gap.estimatedTime || "3-4 hours",
            priority: gap.priority,
          };
        },
      );

      const weeks: RoadmapWeek[] = [];

      for (let i = 0; i < generatedModules.length; i += 2) {
        const weekModules = generatedModules.slice(i, i + 2);

        weeks.push({
          week: weeks.length + 1,
          title:
            weeks.length === 0
              ? "Priority Skill Foundations"
              : `Skill Development Week ${weeks.length + 1}`,
          modules: weekModules,
        });
      }

      if (weeks.length === 0) {
        weeks.push({
          week: 1,
          title: "Build Stronger Career Evidence",
          modules: [
            {
              id: "portfolio-foundation",
              skill: "Portfolio",
              title: "Strengthen Your Portfolio",
              topics: [
                "Document projects",
                "Add measurable outcomes",
                "Improve project explanations",
                "Prepare evidence",
              ],
              duration: "2-3 hours",
              priority: "Medium",
            },
          ],
        });
      }

      const generatedRoadmap: StoredRoadmap = {
        role: parsedGaps.role,
        gaps: parsedGaps.gaps,
        weeks,
        totalModules: generatedModules.length || 1,
        estimatedWeeks: weeks.length,
      };

      sessionStorage.setItem(
        "careerpilot_roadmap",
        JSON.stringify(generatedRoadmap),
      );

      setRoadmap(generatedRoadmap);

      const allModules = weeks.flatMap((week) => week.modules);
      const savedProgress = localStorage.getItem(
        "careerpilot_roadmap_progress",
      );

      setCompleted(
        normalizeProgress(
          savedProgress ? JSON.parse(savedProgress) : null,
          allModules,
        ),
      );

      setReady(true);
    } catch (error) {
      console.error("Could not load roadmap:", error);
      setReady(true);
    }
  }, []);

  const allModules = useMemo(
    () => roadmap?.weeks.flatMap((week) => week.modules) ?? [],
    [roadmap],
  );

  const completedCount = allModules.filter(
    (module) => completed[module.id],
  ).length;

  const totalModules = allModules.length;

  const progress =
    totalModules > 0
      ? Math.round((completedCount / totalModules) * 100)
      : 0;

  useEffect(() => {
    if (!ready || !roadmap) {
      return;
    }

    localStorage.setItem(
      "careerpilot_roadmap_progress",
      JSON.stringify(completed),
    );

    localStorage.setItem(
      "careerpilot_roadmap_progress_summary",
      JSON.stringify({
        progress,
        completedCount,
        totalModules,
        updatedAt: new Date().toISOString(),
      }),
    );
  }, [completed, completedCount, progress, ready, roadmap, totalModules]);

  const toggleModule = (moduleId: string) => {
    setCompleted((current) => ({
      ...current,
      [moduleId]: !current[moduleId],
    }));
  };

  const resetProgress = () => {
    setCompleted({});
    localStorage.removeItem("careerpilot_roadmap_progress");
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-violet-400" />
          <p className="mt-4 text-sm text-slate-400">
            Preparing your roadmap...
          </p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <Target className="mx-auto h-12 w-12 text-violet-300" />

          <h1 className="mt-5 text-2xl font-semibold">
            Roadmap data not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Please complete the skill gap analysis first so CareerPilot can
            generate your personalized roadmap.
          </p>

          <button
            onClick={() => navigate("/gaps")}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Back to Skill Gaps
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="mb-10 flex items-center justify-between">
          <button
            onClick={() => navigate("/gaps")}
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Skill Gaps
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400">
              <Sparkles className="h-5 w-5" />
            </div>

            <span className="text-lg font-semibold">CareerPilot AI</span>
          </div>
        </header>

        <div className="mb-12">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="font-medium text-violet-300">
              Step 7 of 10
            </span>

            <span className="text-slate-500">
              {progress}% roadmap complete
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <section className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-300">
            <BookOpen className="h-4 w-4" />
            Personalized Learning Roadmap
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your path to{" "}
            <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
              {roadmap.role.title}
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-400">
            Work through the recommended modules based on your current skill
            gaps. Mark modules complete as you learn to keep your progress
            updated.
          </p>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">Overall progress</p>
            <p className="mt-2 text-3xl font-bold">{progress}%</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">Modules completed</p>
            <p className="mt-2 text-3xl font-bold">
              {completedCount}/{totalModules}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">Estimated duration</p>
            <p className="mt-2 text-3xl font-bold">
              {roadmap.estimatedWeeks} weeks
            </p>
          </div>
        </section>

        <section className="space-y-6">
          {roadmap.weeks.map((week) => (
            <div
              key={week.week}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-violet-300">
                    Week {week.week}
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    {week.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock3 className="h-4 w-4" />
                  {week.modules.length} module
                  {week.modules.length === 1 ? "" : "s"}
                </div>
              </div>

              <div className="space-y-4">
                {week.modules.map((module) => {
                  const isComplete = Boolean(completed[module.id]);

                  return (
                    <div
                      key={module.id}
                      className={`rounded-2xl border p-5 transition ${
                        isComplete
                          ? "border-emerald-400/20 bg-emerald-400/[0.04]"
                          : "border-white/10 bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex gap-4">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                              isComplete
                                ? "bg-emerald-400/10 text-emerald-300"
                                : "bg-violet-400/10 text-violet-300"
                            }`}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="h-6 w-6" />
                            ) : (
                              <BookOpen className="h-5 w-5" />
                            )}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold">
                                {module.title}
                              </h3>

                              <span
                                className={`rounded-full px-2 py-1 text-[10px] ${
                                  module.priority === "High"
                                    ? "bg-rose-400/10 text-rose-300"
                                    : "bg-amber-400/10 text-amber-300"
                                }`}
                              >
                                {module.priority} priority
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-violet-300">
                              {module.skill}
                            </p>

                            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                              <Clock3 className="h-3.5 w-3.5" />
                              {module.duration}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleModule(module.id)}
                          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                            isComplete
                              ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/15"
                              : "bg-white text-slate-950 hover:bg-slate-200"
                          }`}
                        >
                          <CheckCircle2 className="h-4 w-4" />

                          {isComplete ? "Completed" : "Mark Complete"}
                        </button>
                      </div>

                      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {module.topics.map((topic) => (
                          <div
                            key={topic}
                            className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-xs text-slate-400"
                          >
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-violet-300">
                Learning progress
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                {progress === 100
                  ? "Roadmap completed 🎉"
                  : `${totalModules - completedCount} module${
                      totalModules - completedCount === 1 ? "" : "s"
                    } remaining`}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Your progress is saved in this browser, so refreshing the page
                will not remove completed modules.
              </p>
            </div>

            <button
              onClick={resetProgress}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08]"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Progress
            </button>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate("/gaps")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.07]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Gaps
          </button>

          <button
            onClick={() => navigate("/projects")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Continue to Projects
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}