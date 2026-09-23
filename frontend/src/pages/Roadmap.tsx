import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Code2,
  Database,
  GitBranch,
  Layers3,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
} from "lucide-react";

type Role = {
  id: string;
  title: string;
  description: string;
  skills: string[];
};

type SkillGap = {
  skill: string;
  current: string;
  required: string;
  priority: "High" | "Medium";
  reason: string;
  focus: string;
  learningTime: string;
};

type StoredGaps = {
  role?: Role;
  gaps?: SkillGap[];
  highPriorityCount?: number;
  mediumPriorityCount?: number;
};

type RoadmapModule = {
  skill: string;
  title: string;
  description: string;
  topics: string[];
  duration: string;
  priority: "High" | "Medium";
  icon: typeof BookOpen;
};

type Week = {
  week: number;
  title: string;
  description: string;
  modules: RoadmapModule[];
};

const moduleLibrary: Record<
  string,
  {
    title: string;
    description: string;
    topics: string[];
    highDuration: string;
    mediumDuration: string;
    icon: typeof BookOpen;
  }
> = {
  Docker: {
    title: "Docker & Containerization",
    description:
      "Learn how to package applications into portable containers and run them consistently across environments.",
    topics: [
      "Docker fundamentals",
      "Images and containers",
      "Dockerfile",
      "Volumes and networking",
      "Containerizing an API",
    ],
    highDuration: "5–7 days",
    mediumDuration: "3–4 days",
    icon: Layers3,
  },

  "Node.js": {
    title: "Node.js Backend Fundamentals",
    description:
      "Build server-side applications using Node.js and understand its runtime, modules, and asynchronous programming model.",
    topics: [
      "Node.js runtime",
      "npm and packages",
      "Modules",
      "Async/await",
      "File and environment handling",
    ],
    highDuration: "5–7 days",
    mediumDuration: "3–4 days",
    icon: Terminal,
  },

  "REST APIs": {
    title: "REST API Development",
    description:
      "Understand how modern applications communicate through HTTP APIs and build clean backend endpoints.",
    topics: [
      "HTTP methods",
      "Status codes",
      "Request and response design",
      "Validation",
      "API testing",
    ],
    highDuration: "4–6 days",
    mediumDuration: "2–3 days",
    icon: GitBranch,
  },

  React: {
    title: "React Application Development",
    description:
      "Build interactive component-based interfaces and connect them with backend services.",
    topics: [
      "Components",
      "Props and state",
      "Hooks",
      "Forms",
      "API integration",
    ],
    highDuration: "5–7 days",
    mediumDuration: "3–4 days",
    icon: Code2,
  },

  JavaScript: {
    title: "Modern JavaScript",
    description:
      "Strengthen the JavaScript fundamentals required for modern frontend development.",
    topics: [
      "ES6+ syntax",
      "Functions and objects",
      "Arrays and methods",
      "Async/await",
      "Modules and APIs",
    ],
    highDuration: "5–7 days",
    mediumDuration: "3–4 days",
    icon: Code2,
  },

  HTML: {
    title: "HTML & Web Structure",
    description:
      "Learn how to structure accessible, semantic, and well-organized web pages.",
    topics: [
      "Semantic HTML",
      "Forms",
      "Links and media",
      "Tables",
      "Accessibility basics",
    ],
    highDuration: "3–5 days",
    mediumDuration: "1–2 days",
    icon: Code2,
  },

  CSS: {
    title: "CSS & Responsive Design",
    description:
      "Create responsive layouts and polished interfaces using modern CSS techniques.",
    topics: [
      "Flexbox",
      "CSS Grid",
      "Responsive design",
      "Positioning",
      "Reusable styling",
    ],
    highDuration: "4–6 days",
    mediumDuration: "2–3 days",
    icon: Code2,
  },

  Git: {
    title: "Git & Version Control",
    description:
      "Build confidence with version control and collaborative development workflows.",
    topics: [
      "Repositories",
      "Commits",
      "Branches",
      "Merging",
      "Pull requests",
    ],
    highDuration: "3–4 days",
    mediumDuration: "1–2 days",
    icon: GitBranch,
  },

  Python: {
    title: "Python Programming",
    description:
      "Strengthen Python fundamentals through practical programming exercises.",
    topics: [
      "Python syntax",
      "Functions",
      "Collections",
      "Modules",
      "Error handling",
    ],
    highDuration: "5–7 days",
    mediumDuration: "3–4 days",
    icon: Code2,
  },

  SQL: {
    title: "SQL & Database Queries",
    description:
      "Learn how to retrieve, transform, and analyze structured data using SQL.",
    topics: [
      "SELECT queries",
      "JOINs",
      "GROUP BY",
      "Subqueries",
      "CTEs and window functions",
    ],
    highDuration: "5–7 days",
    mediumDuration: "3–4 days",
    icon: Database,
  },

  Excel: {
    title: "Excel for Data Analysis",
    description:
      "Build practical spreadsheet skills for data cleaning, analysis, and reporting.",
    topics: [
      "Formulas",
      "Lookup functions",
      "Pivot tables",
      "Charts",
      "Data cleaning",
    ],
    highDuration: "4–6 days",
    mediumDuration: "2–3 days",
    icon: Database,
  },

  "Power BI": {
    title: "Power BI & Business Intelligence",
    description:
      "Turn raw data into interactive dashboards and decision-ready reports.",
    topics: [
      "Power Query",
      "Data modeling",
      "Relationships",
      "DAX basics",
      "Interactive dashboards",
    ],
    highDuration: "5–7 days",
    mediumDuration: "3–4 days",
    icon: TrendingUp,
  },

  Pandas: {
    title: "Pandas Data Analysis",
    description:
      "Practice real-world data cleaning and transformation with Python Pandas.",
    topics: [
      "DataFrames",
      "Filtering",
      "Grouping",
      "Missing values",
      "Data transformation",
    ],
    highDuration: "4–6 days",
    mediumDuration: "2–3 days",
    icon: Database,
  },

  Statistics: {
    title: "Statistics Fundamentals",
    description:
      "Develop statistical reasoning for data analysis and evidence-based conclusions.",
    topics: [
      "Descriptive statistics",
      "Probability",
      "Distributions",
      "Correlation",
      "Hypothesis testing",
    ],
    highDuration: "5–7 days",
    mediumDuration: "3–4 days",
    icon: TrendingUp,
  },

  "Machine Learning": {
    title: "Machine Learning Foundations",
    description:
      "Learn the core workflow for training, evaluating, and improving machine learning models.",
    topics: [
      "Supervised learning",
      "Preprocessing",
      "Feature engineering",
      "Model training",
      "Evaluation metrics",
    ],
    highDuration: "7–10 days",
    mediumDuration: "4–6 days",
    icon: Database,
  },

  "Scikit-learn": {
    title: "Scikit-learn Practical ML",
    description:
      "Build practical machine learning workflows using Scikit-learn.",
    topics: [
      "Preprocessing",
      "Pipelines",
      "Model training",
      "Cross-validation",
      "Model evaluation",
    ],
    highDuration: "5–7 days",
    mediumDuration: "3–4 days",
    icon: Database,
  },

  Figma: {
    title: "Figma UI Design",
    description:
      "Create polished interface designs, reusable components, and interactive prototypes.",
    topics: [
      "Frames",
      "Components",
      "Auto layout",
      "Design systems",
      "Prototyping",
    ],
    highDuration: "5–7 days",
    mediumDuration: "3–4 days",
    icon: Layers3,
  },

  Linux: {
    title: "Linux Fundamentals",
    description:
      "Build the command-line and operating-system knowledge needed for cloud and DevOps workflows.",
    topics: [
      "Shell commands",
      "Filesystems",
      "Permissions",
      "Processes",
      "Networking basics",
    ],
    highDuration: "5–7 days",
    mediumDuration: "3–4 days",
    icon: Terminal,
  },

  Kubernetes: {
    title: "Kubernetes Fundamentals",
    description:
      "Understand the core concepts behind deploying and managing containerized workloads.",
    topics: [
      "Pods",
      "Deployments",
      "Services",
      "Configuration",
      "Scaling",
    ],
    highDuration: "7–10 days",
    mediumDuration: "4–6 days",
    icon: Layers3,
  },

  AWS: {
    title: "AWS Cloud Fundamentals",
    description:
      "Learn the core cloud concepts needed to deploy and operate applications on AWS.",
    topics: [
      "IAM",
      "Compute",
      "Storage",
      "Networking",
      "Monitoring",
    ],
    highDuration: "7–10 days",
    mediumDuration: "4–6 days",
    icon: Layers3,
  },

  "CI/CD": {
    title: "CI/CD & Automation",
    description:
      "Automate testing and software delivery through modern CI/CD workflows.",
    topics: [
      "Pipeline concepts",
      "Automated testing",
      "Build stages",
      "Deployment",
      "GitHub Actions",
    ],
    highDuration: "5–7 days",
    mediumDuration: "3–4 days",
    icon: GitBranch,
  },

  Java: {
    title: "Java Programming",
    description:
      "Build strong Java programming fundamentals through practical application development.",
    topics: [
      "OOP",
      "Collections",
      "Exceptions",
      "Interfaces",
      "Packages",
    ],
    highDuration: "7–10 days",
    mediumDuration: "4–6 days",
    icon: Code2,
  },

  Kotlin: {
    title: "Kotlin Development",
    description:
      "Learn Kotlin fundamentals and modern programming patterns for Android development.",
    topics: [
      "Kotlin syntax",
      "Null safety",
      "Classes",
      "Collections",
      "Coroutines",
    ],
    highDuration: "7–10 days",
    mediumDuration: "4–6 days",
    icon: Code2,
  },

  Flutter: {
    title: "Flutter Mobile Development",
    description:
      "Build cross-platform mobile applications using Flutter and Dart.",
    topics: [
      "Dart fundamentals",
      "Widgets",
      "Layouts",
      "Navigation",
      "API integration",
    ],
    highDuration: "7–10 days",
    mediumDuration: "4–6 days",
    icon: Code2,
  },

  "React Native": {
    title: "React Native Mobile Development",
    description:
      "Use React concepts to build cross-platform mobile applications.",
    topics: [
      "Components",
      "Navigation",
      "State",
      "API integration",
      "Mobile UI",
    ],
    highDuration: "7–10 days",
    mediumDuration: "4–6 days",
    icon: Code2,
  },
};

function getModuleForGap(gap: SkillGap): RoadmapModule {
  const libraryItem = moduleLibrary[gap.skill];

  if (!libraryItem) {
    return {
      skill: gap.skill,
      title: `${gap.skill} Skill Development`,
      description:
        `Build practical proficiency in ${gap.skill} through focused learning and hands-on practice.`,
      topics: [
        `${gap.skill} fundamentals`,
        "Core concepts",
        "Practical exercises",
        "Real-world usage",
        "Mini project",
      ],
      duration: gap.learningTime,
      priority: gap.priority,
      icon: BookOpen,
    };
  }

  return {
    skill: gap.skill,
    title: libraryItem.title,
    description: libraryItem.description,
    topics: libraryItem.topics,
    duration:
      gap.priority === "High"
        ? libraryItem.highDuration
        : libraryItem.mediumDuration,
    priority: gap.priority,
    icon: libraryItem.icon,
  };
}

function createWeeks(gaps: SkillGap[]): Week[] {
  const sortedGaps = [...gaps].sort((a, b) => {
    if (a.priority === b.priority) return 0;
    return a.priority === "High" ? -1 : 1;
  });

  const modules = sortedGaps.map(getModuleForGap);

  if (modules.length === 0) {
    return [
      {
        week: 1,
        title: "Strengthen Existing Skills",
        description:
          "Your current profile has no identified skill gaps, so use this week to deepen your strongest skills through practical work.",
        modules: [
          {
            skill: "Practical Development",
            title: "Build a Role-Relevant Project",
            description:
              "Apply your existing skills in a realistic project that creates stronger evidence of practical ability.",
            topics: [
              "Project planning",
              "Implementation",
              "Testing",
              "Documentation",
              "Portfolio preparation",
            ],
            duration: "1 week",
            priority: "Medium",
            icon: Target,
          },
        ],
      },
    ];
  }

  const weeks: Week[] = [];

  for (let index = 0; index < modules.length; index += 2) {
    const weekModules = modules.slice(index, index + 2);

    weeks.push({
      week: weeks.length + 1,
      title:
        weekModules.length === 1
          ? weekModules[0].title
          : `${weekModules[0].skill} + ${weekModules[1].skill}`,
      description:
        weekModules.length === 1
          ? `Focused learning plan for ${weekModules[0].skill}.`
          : `Focused learning block covering ${weekModules[0].skill} and ${weekModules[1].skill}.`,
      modules: weekModules,
    });
  }

  const projectWeekNumber = weeks.length + 1;

  weeks.push({
    week: projectWeekNumber,
    title: "Capstone Project & Evidence",
    description:
      "Combine your newly developed skills in one practical project that creates stronger evidence for your target role.",
    modules: [
      {
        skill: "Capstone",
        title: "Role-Ready Portfolio Project",
        description:
          `Build a practical ${gaps.length > 0 ? gaps.map((gap) => gap.skill).slice(0, 3).join(", ") : "role"} project and document the work.`,
        topics: [
          "Project planning",
          "Implementation",
          "Testing",
          "Documentation",
          "Portfolio evidence",
        ],
        duration: "1–2 weeks",
        priority: "High",
        icon: Target,
      },
    ],
  });

  return weeks;
}

export default function Roadmap() {
  const navigate = useNavigate();

  const [storedGaps, setStoredGaps] = useState<StoredGaps | null>(null);

  useEffect(() => {
    const saved =
      sessionStorage.getItem("careerpilot_gaps");

    if (!saved) {
      return;
    }

    try {
      setStoredGaps(JSON.parse(saved));
    } catch (error) {
      console.error("Could not read gap data:", error);
    }
  }, []);

  const role = storedGaps?.role;
  const gaps = storedGaps?.gaps || [];

  const weeks = useMemo(() => createWeeks(gaps), [gaps]);

  const totalModules = weeks.reduce(
    (total, week) => total + week.modules.length,
    0
  );

  const highPriority = gaps.filter(
    (gap) => gap.priority === "High"
  ).length;

  const estimatedWeeks = weeks.length;

  const handleContinue = () => {
    sessionStorage.setItem(
      "careerpilot_roadmap",
      JSON.stringify({
        role,
        gaps,
        weeks,
        totalModules,
        estimatedWeeks,
      })
    );

    navigate("/projects");
  };

  if (!storedGaps || !role) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
              <Target className="h-7 w-7 text-amber-300" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Roadmap data not found
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Please complete the skill gap analysis before viewing your
              personalized roadmap.
            </p>

            <button
              onClick={() => navigate("/gaps")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Skill Gaps
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <button
            onClick={() => navigate("/gaps")}
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Skill Gaps
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400">
              <Sparkles className="h-5 w-5 text-white" />
            </div>

            <span className="text-lg font-semibold tracking-tight">
              CareerPilot AI
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="font-medium text-violet-300">
              Step 8 of 10
            </span>

            <span className="text-slate-500">80% complete</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
          </div>
        </div>

        {/* Heading */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Personalized Learning Path
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your Learning Roadmap
          </h1>

          <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
            A focused roadmap for becoming more prepared for the{" "}
            <span className="font-semibold text-white">
              {role.title}
            </span>{" "}
            role, based on your current skill gaps.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Target Role</p>
              <Target className="h-5 w-5 text-violet-300" />
            </div>

            <p className="mt-3 text-lg font-bold">
              {role.title}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Estimated Roadmap
              </p>
              <Clock3 className="h-5 w-5 text-cyan-300" />
            </div>

            <p className="mt-3 text-3xl font-bold">
              {estimatedWeeks}
              <span className="ml-1 text-sm font-normal text-slate-500">
                weeks
              </span>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Learning Modules
              </p>
              <BookOpen className="h-5 w-5 text-emerald-300" />
            </div>

            <p className="mt-3 text-3xl font-bold">
              {totalModules}
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Priority Gaps
              </p>
              <TrendingUp className="h-5 w-5 text-rose-300" />
            </div>

            <p className="mt-3 text-3xl font-bold text-rose-300">
              {highPriority}
            </p>
          </div>
        </div>

        {/* AI Insight */}
        <div className="mb-8 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-violet-500/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
              <Sparkles className="h-5 w-5 text-cyan-300" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-cyan-300">
                CareerPilot Insight
              </p>

              <h3 className="mt-2 text-lg font-semibold">
                Focus on evidence, not just course completion
              </h3>

              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
                The roadmap prioritizes skills that are missing or below
                the configured target level. After learning each skill,
                use it in a practical project so your portfolio contains
                stronger evidence of applied ability.
              </p>
            </div>
          </div>
        </div>

        {/* Weeks */}
        <div className="space-y-6">
          {weeks.map((week, index) => (
            <div
              key={week.week}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60"
            >
              {/* Week Header */}
              <div className="border-b border-slate-800 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        index === 0
                          ? "bg-violet-500/15"
                          : "bg-slate-800"
                      }`}
                    >
                      {index === 0 ? (
                        <BookOpen className="h-5 w-5 text-violet-300" />
                      ) : (
                        <span className="text-sm font-bold text-slate-400">
                          {week.week}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        Week {week.week}
                      </p>

                      <h2 className="mt-1 text-xl font-semibold">
                        {week.title}
                      </h2>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        {week.description}
                      </p>
                    </div>
                  </div>

                  {index === 0 && (
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      Start here
                    </span>
                  )}
                </div>
              </div>

              {/* Modules */}
              <div className="grid gap-4 p-6 lg:grid-cols-2">
                {week.modules.map((module) => {
                  const Icon = module.icon;

                  return (
                    <div
                      key={`${week.week}-${module.skill}`}
                      className="rounded-xl border border-slate-800 bg-slate-950/40 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800">
                            <Icon className="h-5 w-5 text-cyan-300" />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold">
                                {module.title}
                              </h3>

                              {module.priority === "High" && (
                                <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-300">
                                  High Priority
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs text-slate-500">
                              {module.skill}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-500">
                          <Clock3 className="h-3.5 w-3.5" />
                          {module.duration}
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-slate-400">
                        {module.description}
                      </p>

                      <div className="mt-5">
                        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-600">
                          Topics
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {module.topics.map((topic) => (
                            <span
                              key={topic}
                              className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-400"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Completion Strategy */}
        <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />

            <div>
              <h3 className="font-semibold">
                How to use this roadmap
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Complete each learning block, practice the concepts, and
                create evidence through projects. CareerPilot can then use
                your updated progress to track skill development over time.
              </p>
            </div>
          </div>
        </div>

        {/* Continue */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate("/gaps")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-900 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Gaps
          </button>

          <button
            onClick={handleContinue}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:scale-[1.01]"
          >
            Continue to Projects
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          Roadmap duration is an estimate based on the configured skill-gap
          framework and is not a guarantee of learning time.
        </p>
      </div>
    </div>
  );
}