import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Code2,
  Database,
  Gauge,
  Layers3,
  Rocket,
  Sparkles,
  Star,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Project = {
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  skills: string[];
  coverage: string;
  icon: typeof Code2;
  recommended: boolean;
};

const projects: Project[] = [
  {
    title: "Production-Style Task Management API",
    description:
      "Build a complete backend API where users can create, update, assign, and track tasks with authentication and validation.",
    difficulty: "Intermediate",
    duration: "2–3 weeks",
    skills: [
      "Node.js",
      "REST APIs",
      "Express.js",
      "PostgreSQL",
      "Docker",
      "Testing",
    ],
    coverage: "4 major skill gaps",
    icon: Rocket,
    recommended: true,
  },
  {
    title: "Expense Tracker Backend",
    description:
      "Create a REST API for managing personal expenses, categories, budgets, and monthly spending summaries.",
    difficulty: "Beginner–Intermediate",
    duration: "1–2 weeks",
    skills: ["Node.js", "REST APIs", "SQL", "Testing"],
    coverage: "3 major skill gaps",
    icon: Database,
    recommended: false,
  },
  {
    title: "Real-Time Collaboration API",
    description:
      "Build a backend service for collaborative workspaces with users, projects, comments, and real-time updates.",
    difficulty: "Intermediate",
    duration: "2–3 weeks",
    skills: [
      "Node.js",
      "REST APIs",
      "WebSockets",
      "PostgreSQL",
      "Docker",
    ],
    coverage: "3 major skill gaps",
    icon: Layers3,
    recommended: false,
  },
];

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return (
    <span className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
      {difficulty}
    </span>
  );
}

export default function Projects() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/roadmap")}
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Roadmap
          </button>

          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
              CareerPilot AI
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Project Intelligence
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">
              Step 9 of 10
            </span>

            <span className="text-sm text-slate-500">
              Project Recommendations
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
          </div>
        </div>

        {/* Hero */}
        <section className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200">
            <Sparkles className="h-4 w-4" />
            Skill-Gap Based Projects
          </div>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">
            Build projects that{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              close your skill gaps
            </span>
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">
            Instead of suggesting random portfolio projects, CareerPilot AI
            connects each recommendation to the skills you need for your
            selected Backend Developer role.
          </p>
        </section>

        {/* Profile summary */}
        <section className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                <Target className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-slate-500">Target Role</p>
                <p className="font-semibold">Backend Developer</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                <Gauge className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-slate-500">Current Alignment</p>
                <p className="font-semibold">43%</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">
                <Code2 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-slate-500">Major Gaps</p>
                <p className="font-semibold">3 Skills</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recommendation */}
        <section className="mb-10">
          <div className="mb-5 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-300" />
            <h2 className="text-2xl font-bold">Recommended for You</h2>
          </div>

          {projects
            .filter((project) => project.recommended)
            .map((project) => {
              const Icon = project.icon;

              return (
                <div
                  key={project.title}
                  className="relative overflow-hidden rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/10 via-slate-900/90 to-cyan-500/5 p-7"
                >
                  <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

                  <div className="relative grid gap-8 lg:grid-cols-[1fr_300px]">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                          <Icon className="h-6 w-6" />
                        </div>

                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                            Best Skill Coverage
                          </span>

                          <h3 className="mt-1 text-2xl font-bold">
                            {project.title}
                          </h3>
                        </div>
                      </div>

                      <p className="mt-5 max-w-3xl leading-7 text-slate-400">
                        {project.description}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {project.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-400">
                        <span className="inline-flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-cyan-300" />
                          {project.duration}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <Target className="h-4 w-4 text-violet-300" />
                          {project.coverage}
                        </span>

                        <DifficultyBadge difficulty={project.difficulty} />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Skill Coverage
                      </p>

                      <div className="mt-4 space-y-3">
                        {[
                          "Node.js",
                          "REST APIs",
                          "Docker",
                          "Testing",
                        ].map((skill) => (
                          <div
                            key={skill}
                            className="flex items-center gap-2 text-sm text-slate-300"
                          >
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            {skill}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => navigate("/track")}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3 text-sm font-semibold transition hover:scale-[1.01]"
                      >
                        Start Project
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </section>

        {/* Other projects */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold">More Projects</h2>
            <p className="mt-1 text-sm text-slate-500">
              Alternative projects that also improve your target-role skills.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {projects
              .filter((project) => !project.recommended)
              .map((project) => {
                const Icon = project.icon;

                return (
                  <div
                    key={project.title}
                    className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-slate-700 hover:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-cyan-300">
                        <Icon className="h-5 w-5" />
                      </div>

                      <DifficultyBadge difficulty={project.difficulty} />
                    </div>

                    <h3 className="mt-5 text-xl font-bold">
                      {project.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {project.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">
                      <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                        <Clock3 className="h-4 w-4" />
                        {project.duration}
                      </span>

                      <span className="text-xs font-medium text-cyan-300">
                        {project.coverage}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* Insight */}
        <section className="mt-10 rounded-3xl border border-emerald-400/20 bg-emerald-500/5 p-6">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold text-emerald-200">
                Why this project was recommended
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                This project covers multiple identified gaps at once. Completing
                it gives you practical evidence of Node.js, REST API design,
                Docker, and testing skills that can later be added to your
                CareerPilot profile.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate("/roadmap")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Roadmap
          </button>

          <button
            onClick={() => navigate("/track")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Go to Progress Tracking
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          Project recommendations are based on identified skill gaps and the
          selected role framework.
        </p>
      </div>
    </main>
  );
}