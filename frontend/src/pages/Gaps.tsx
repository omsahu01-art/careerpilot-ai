import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

type MatchStatus = "matched" | "partial" | "missing";

type SkillMatch = {
  skill: string;
  required: string;
  current: string;
  status: MatchStatus;
  evidence: string;
  confidence: number;
  source: string;
};

type Role = {
  id: string;
  title: string;
  description: string;
  skills: string[];
};

type AlignmentData = {
  role?: Role;
  alignment?: number;
  summary?: {
    matched: number;
    partial: number;
    missing: number;
    total: number;
  };
  matches?: SkillMatch[];
};

type GapPriority = "High" | "Medium";

type SkillGap = {
  skill: string;
  current: string;
  required: string;
  priority: GapPriority;
  reason: string;
  focus: string;
  learningTime: string;
};

const gapMetadata: Record<
  string,
  {
    reason: string;
    focus: string;
    highTime: string;
    mediumTime: string;
  }
> = {
  Docker: {
    reason:
      "Containerization is commonly used to package backend applications consistently across development and deployment environments.",
    focus:
      "Learn Docker images, containers, Dockerfiles, volumes, networking, and containerizing a backend API.",
    highTime: "1–2 weeks",
    mediumTime: "3–5 days",
  },

  "Node.js": {
    reason:
      "Node.js is useful for building server-side JavaScript applications and understanding modern backend runtime patterns.",
    focus:
      "Learn Node.js fundamentals, modules, npm, asynchronous programming, file handling, and backend application structure.",
    highTime: "1–2 weeks",
    mediumTime: "3–5 days",
  },

  "REST APIs": {
    reason:
      "REST APIs are a core way for frontend applications and backend services to communicate.",
    focus:
      "Practice HTTP methods, status codes, request/response structure, authentication, validation, and API design.",
    highTime: "4–7 days",
    mediumTime: "2–4 days",
  },

  React: {
    reason:
      "React is commonly used to build component-based interactive web interfaces.",
    focus:
      "Learn components, props, state, hooks, events, forms, routing, and API integration.",
    highTime: "1–2 weeks",
    mediumTime: "3–5 days",
  },

  JavaScript: {
    reason:
      "JavaScript provides the programming foundation for modern browser-based applications.",
    focus:
      "Practice ES6+, functions, arrays, objects, async/await, DOM concepts, modules, and API calls.",
    highTime: "1–2 weeks",
    mediumTime: "4–7 days",
  },

  HTML: {
    reason:
      "HTML provides the structural foundation of web pages and applications.",
    focus:
      "Practice semantic HTML, forms, accessibility, tables, links, media, and page structure.",
    highTime: "3–5 days",
    mediumTime: "1–3 days",
  },

  CSS: {
    reason:
      "CSS is required to create responsive and usable web interfaces.",
    focus:
      "Practice layouts, Flexbox, Grid, responsive design, positioning, and reusable styling patterns.",
    highTime: "4–7 days",
    mediumTime: "2–4 days",
  },

  Git: {
    reason:
      "Version control is important for maintaining code history and collaborating on software projects.",
    focus:
      "Practice repositories, branches, commits, merges, pull requests, and resolving conflicts.",
    highTime: "3–5 days",
    mediumTime: "1–2 days",
  },

  Python: {
    reason:
      "Python is a foundational programming skill for many data, automation, and backend workflows.",
    focus:
      "Practice Python syntax, functions, collections, modules, error handling, OOP, and practical scripting.",
    highTime: "1–2 weeks",
    mediumTime: "3–5 days",
  },

  SQL: {
    reason:
      "SQL is important for querying, transforming, and analyzing structured data.",
    focus:
      "Practice SELECT, JOINs, GROUP BY, subqueries, CTEs, window functions, and data cleaning queries.",
    highTime: "1–2 weeks",
    mediumTime: "3–5 days",
  },

  Excel: {
    reason:
      "Spreadsheet skills support data cleaning, analysis, reporting, and business workflows.",
    focus:
      "Practice formulas, lookup functions, pivot tables, charts, filtering, and data cleaning.",
    highTime: "4–7 days",
    mediumTime: "2–4 days",
  },

  "Power BI": {
    reason:
      "Business intelligence tools help turn analyzed data into dashboards and decision-ready insights.",
    focus:
      "Practice Power Query, data modeling, relationships, DAX basics, dashboards, and interactive reports.",
    highTime: "1–2 weeks",
    mediumTime: "3–5 days",
  },

  Pandas: {
    reason:
      "Pandas is widely used for practical data cleaning, transformation, and analysis in Python.",
    focus:
      "Practice DataFrames, filtering, grouping, joins, missing values, transformations, and exporting data.",
    highTime: "4–7 days",
    mediumTime: "2–4 days",
  },

  Statistics: {
    reason:
      "Statistical reasoning helps interpret data correctly and support evidence-based conclusions.",
    focus:
      "Practice descriptive statistics, probability, distributions, correlation, hypothesis testing, and interpretation.",
    highTime: "1–2 weeks",
    mediumTime: "4–7 days",
  },

  "Machine Learning": {
    reason:
      "Machine learning skills help build and evaluate predictive models from structured data.",
    focus:
      "Practice supervised learning, preprocessing, feature engineering, model evaluation, and common algorithms.",
    highTime: "2–3 weeks",
    mediumTime: "1 week",
  },

  "Scikit-learn": {
    reason:
      "Scikit-learn provides practical tools for building and evaluating machine learning workflows in Python.",
    focus:
      "Practice preprocessing, pipelines, model training, cross-validation, metrics, and model selection.",
    highTime: "1–2 weeks",
    mediumTime: "4–7 days",
  },

  Figma: {
    reason:
      "Figma is commonly used for interface design, wireframes, prototypes, and collaborative design workflows.",
    focus:
      "Practice components, auto layout, design systems, wireframes, prototypes, and responsive UI design.",
    highTime: "1–2 weeks",
    mediumTime: "3–5 days",
  },

  Linux: {
    reason:
      "Linux fundamentals are useful for server administration, automation, and cloud environments.",
    focus:
      "Practice shell commands, filesystems, permissions, processes, networking, packages, and basic scripting.",
    highTime: "1–2 weeks",
    mediumTime: "3–5 days",
  },

  Kubernetes: {
    reason:
      "Kubernetes helps manage containerized applications across distributed environments.",
    focus:
      "Learn pods, deployments, services, configuration, scaling, namespaces, and basic cluster operations.",
    highTime: "2–3 weeks",
    mediumTime: "1 week",
  },

  AWS: {
    reason:
      "Cloud fundamentals help developers deploy, operate, and scale applications using managed infrastructure.",
    focus:
      "Learn core AWS services, IAM, compute, storage, networking, monitoring, and basic deployment workflows.",
    highTime: "2–3 weeks",
    mediumTime: "1 week",
  },

  "CI/CD": {
    reason:
      "CI/CD practices automate testing and software delivery, making development workflows more reliable.",
    focus:
      "Learn pipelines, automated testing, build stages, deployment workflows, environment variables, and GitHub Actions.",
    highTime: "1–2 weeks",
    mediumTime: "3–5 days",
  },

  Java: {
    reason:
      "Java is a widely used programming language for enterprise and Android development.",
    focus:
      "Practice OOP, collections, exceptions, interfaces, packages, and building small Java applications.",
    highTime: "2–3 weeks",
    mediumTime: "1 week",
  },

  Kotlin: {
    reason:
      "Kotlin is commonly used for modern Android application development.",
    focus:
      "Learn Kotlin syntax, null safety, classes, collections, coroutines, and Android fundamentals.",
    highTime: "2–3 weeks",
    mediumTime: "1 week",
  },

  Flutter: {
    reason:
      "Flutter enables cross-platform mobile application development using a shared codebase.",
    focus:
      "Practice Dart, widgets, layouts, navigation, state management, APIs, and responsive mobile UI.",
    highTime: "2–3 weeks",
    mediumTime: "1 week",
  },

  "React Native": {
    reason:
      "React Native allows developers to build mobile applications using React concepts.",
    focus:
      "Practice components, navigation, state, native modules, API integration, and mobile UI patterns.",
    highTime: "2–3 weeks",
    mediumTime: "1 week",
  },
};

function getGapMetadata(skill: string, priority: GapPriority) {
  const metadata = gapMetadata[skill];

  if (metadata) {
    return {
      reason: metadata.reason,
      focus: metadata.focus,
      learningTime:
        priority === "High" ? metadata.highTime : metadata.mediumTime,
    };
  }

  return {
    reason:
      "This skill is part of the selected role framework but is not yet sufficiently demonstrated in your resume.",
    focus: `Build practical experience with ${skill} through structured learning and a small project.`,
    learningTime: priority === "High" ? "1–2 weeks" : "3–5 days",
  };
}

export default function Gaps() {
  const navigate = useNavigate();

  const [alignmentData, setAlignmentData] =
    useState<AlignmentData | null>(null);

  useEffect(() => {
    const storedAlignment =
      sessionStorage.getItem("careerpilot_alignment");

    if (!storedAlignment) {
      return;
    }

    try {
      const parsedData: AlignmentData = JSON.parse(storedAlignment);
      setAlignmentData(parsedData);
    } catch (error) {
      console.error("Could not read alignment data:", error);
    }
  }, []);

  const matches = alignmentData?.matches || [];
  const role = alignmentData?.role;

  const gaps = useMemo<SkillGap[]>(() => {
    return matches
      .filter(
        (match) =>
          match.status === "missing" || match.status === "partial"
      )
      .map((match) => {
        const priority: GapPriority =
          match.status === "missing" ? "High" : "Medium";

        const metadata = getGapMetadata(match.skill, priority);

        return {
          skill: match.skill,
          current: match.current,
          required: match.required,
          priority,
          reason: metadata.reason,
          focus: metadata.focus,
          learningTime: metadata.learningTime,
        };
      });
  }, [matches]);

  const highPriorityGaps = gaps.filter(
    (gap) => gap.priority === "High"
  );

  const mediumPriorityGaps = gaps.filter(
    (gap) => gap.priority === "Medium"
  );

  const handleContinue = () => {
    sessionStorage.setItem(
      "careerpilot_gaps",
      JSON.stringify({
        role,
        gaps,
        highPriorityCount: highPriorityGaps.length,
        mediumPriorityCount: mediumPriorityGaps.length,
      })
    );

    navigate("/roadmap");
  };

  if (!alignmentData || !role) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
              <CircleAlert className="h-7 w-7 text-amber-300" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Alignment data not found
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Please complete the role alignment step before viewing your
              skill gaps.
            </p>

            <button
              onClick={() => navigate("/alignment")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Alignment
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
            onClick={() => navigate("/alignment")}
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Alignment
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
              Step 7 of 10
            </span>

            <span className="text-slate-500">70% complete</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
          </div>
        </div>

        {/* Heading */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-300">
            <TrendingUp className="h-3.5 w-3.5" />
            Personalized Skill Analysis
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your Skill Gaps
          </h1>

          <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
            We identified the skills that need more evidence or development
            for your target role of{" "}
            <span className="font-semibold text-white">
              {role.title}
            </span>
            .
          </p>
        </div>

        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Total Gaps</p>
              <Target className="h-5 w-5 text-violet-300" />
            </div>

            <p className="mt-3 text-3xl font-bold">{gaps.length}</p>

            <p className="mt-1 text-xs text-slate-600">
              Skills needing attention
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">High Priority</p>
              <CircleAlert className="h-5 w-5 text-rose-300" />
            </div>

            <p className="mt-3 text-3xl font-bold text-rose-300">
              {highPriorityGaps.length}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Not detected in resume
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Medium Priority</p>
              <TrendingUp className="h-5 w-5 text-amber-300" />
            </div>

            <p className="mt-3 text-3xl font-bold text-amber-300">
              {mediumPriorityGaps.length}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Skills below target level
            </p>
          </div>
        </div>

        {/* No gaps */}
        {gaps.length === 0 && (
          <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-300" />

            <h2 className="mt-4 text-xl font-semibold">
              No current skill gaps detected
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Your detected skill levels currently meet the configured
              requirements for this role framework.
            </p>
          </div>
        )}

        {/* Gap Cards */}
        <div className="space-y-5">
          {gaps.map((gap, index) => (
            <div
              key={gap.skill}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60"
            >
              {/* Top */}
              <div className="flex flex-col gap-5 border-b border-slate-800 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      gap.priority === "High"
                        ? "bg-rose-500/10"
                        : "bg-amber-500/10"
                    }`}
                  >
                    {gap.priority === "High" ? (
                      <CircleAlert className="h-5 w-5 text-rose-300" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-amber-300" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold">
                        {gap.skill}
                      </h2>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          gap.priority === "High"
                            ? "border border-rose-500/20 bg-rose-500/10 text-rose-300"
                            : "border border-amber-500/20 bg-amber-500/10 text-amber-300"
                        }`}
                      >
                        {gap.priority} Priority
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>
                        Current:{" "}
                        <span className="text-slate-300">
                          {gap.current}
                        </span>
                      </span>

                      <span>•</span>

                      <span>
                        Required:{" "}
                        <span className="text-slate-300">
                          {gap.required}
                        </span>
                      </span>

                      <span>•</span>

                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {gap.learningTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-slate-800 md:flex">
                  <span className="text-xs font-semibold text-slate-500">
                    0{index + 1}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="grid gap-5 p-6 md:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
                  <div className="flex items-center gap-2">
                    <CircleAlert className="h-4 w-4 text-amber-300" />
                    <p className="text-sm font-semibold">
                      Why this gap matters
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {gap.reason}
                  </p>
                </div>

                <div className="rounded-xl border border-violet-500/10 bg-violet-500/5 p-5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-violet-300" />
                    <p className="text-sm font-semibold">
                      Recommended focus
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {gap.focus}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Roadmap Preview */}
        <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-violet-500/5 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-300" />

                <p className="text-xs font-medium uppercase tracking-wider text-cyan-300">
                  Next Step
                </p>
              </div>

              <h3 className="mt-2 text-lg font-semibold">
                Build your personalized learning roadmap
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Your roadmap will prioritize these gaps and turn them into
                practical learning modules and projects.
              </p>
            </div>

            <button
              onClick={handleContinue}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:scale-[1.01]"
            >
              Continue to Roadmap
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/alignment")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-900 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Alignment
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          Skill gaps are generated from the selected role framework and
          evidence currently available in your resume.
        </p>
      </div>
    </div>
  );
}