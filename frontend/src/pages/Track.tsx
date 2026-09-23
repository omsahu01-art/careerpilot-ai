import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Code2,
  Flame,
  Target,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

type Match = {
  skill: string;
  required: string;
  current: string;
  status: "matched" | "partial" | "missing";
  confidence: number;
  evidence: string;
  source: string;
};

type Gap = {
  skill: string;
  current: string;
  required: string;
  priority: "High" | "Medium";
  why: string;
  focus: string;
  estimatedTime: string;
};

type RoadmapWeek = {
  week: number;
  title: string;
  modules: {
    skill: string;
    topics: string[];
    duration: string;
    priority: "High" | "Medium";
  }[];
};

type Project = {
  title: string;
  description: string;
  skills: string[];
  difficulty: string;
  estimatedTime: string;
};

type StoredProject = {
  role: {
    id: string;
    title: string;
  };
  project: Project;
  gaps: Gap[];
  startedAt: string;
  progress: number;
};

type StoredRoadmap = {
  role: {
    id: string;
    title: string;
  };
  gaps: Gap[];
  weeks: RoadmapWeek[];
  totalModules: number;
  estimatedWeeks: number;
};

type StoredAlignment = {
  role: {
    id: string;
    title: string;
  };
  alignment: number;
  summary: {
    matched: number;
    partial: number;
    missing: number;
    total: number;
  };
  matches: Match[];
};

export default function Track() {
  const navigate = useNavigate();

  const alignmentData = useMemo<StoredAlignment | null>(() => {
    try {
      const stored = sessionStorage.getItem("careerpilot_alignment");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const roadmapData = useMemo<StoredRoadmap | null>(() => {
    try {
      const stored = sessionStorage.getItem("careerpilot_roadmap");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const projectData = useMemo<StoredProject | null>(() => {
    try {
      const stored = sessionStorage.getItem("careerpilot_project");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const roleTitle =
    alignmentData?.role?.title ||
    roadmapData?.role?.title ||
    projectData?.role?.title ||
    "Selected Career Role";

  const alignment = alignmentData?.alignment ?? 0;
  const matches = alignmentData?.matches ?? [];

  const matchedSkills = matches.filter(
    (match) => match.status === "matched",
  ).length;

  const partialSkills = matches.filter(
    (match) => match.status === "partial",
  ).length;

  const missingSkills = matches.filter(
    (match) => match.status === "missing",
  ).length;

  const totalSkills = matches.length;

  const projectProgress = projectData?.progress ?? 0;

  const roadmapWeeks = roadmapData?.weeks ?? [];

  const completedWeeks = Math.min(
    roadmapWeeks.length,
    Math.floor((projectProgress / 100) * roadmapWeeks.length),
  );

  const roadmapProgress =
    roadmapWeeks.length > 0
      ? Math.round((completedWeeks / roadmapWeeks.length) * 100)
      : 0;

  const skillProgress = matches.map((match) => {
    let progress = 0;

    if (match.status === "matched") {
      progress = 100;
    } else if (match.status === "partial") {
      progress = 60;
    } else {
      progress = 20;
    }

    return {
      skill: match.skill,
      progress,
      status: match.status,
      current: match.current,
      required: match.required,
    };
  });

  const topNextSkill =
    matches.find((match) => match.status === "missing") ||
    matches.find((match) => match.status === "partial");

  const nextRoadmapWeek =
    roadmapWeeks.find((_, index) => index >= completedWeeks) ||
    roadmapWeeks[roadmapWeeks.length - 1];

  const hasData =
    Boolean(alignmentData) ||
    Boolean(roadmapData) ||
    Boolean(projectData);

  const alignmentLabel =
    alignment >= 80
      ? "Strong alignment"
      : alignment >= 60
        ? "Developing alignment"
        : alignment >= 40
          ? "Early alignment"
          : "Needs development";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <button
            onClick={() => navigate("/projects")}
            className="group flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            Back to Projects
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-400/20">
              <Target className="h-5 w-5 text-violet-300" />
            </div>

            <span className="hidden text-lg font-semibold tracking-tight sm:block">
              CareerPilot AI
            </span>
          </div>

          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
            Step 10 of 10
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-300">
                <TrendingUp className="h-4 w-4" />
                Career Progress Dashboard
              </div>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Your career readiness,
                <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                  in one place.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
                Track your role alignment, skill development, learning
                roadmap, and project progress as you prepare for your target
                career.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
                  Target role:{" "}
                  <span className="font-semibold text-white">
                    {roleTitle}
                  </span>
                </div>

                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                  Evidence-based tracking
                </div>
              </div>
            </div>

            {hasData && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-violet-950/20 lg:min-w-[250px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-400/20">
                    <Trophy className="h-5 w-5 text-violet-300" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Current status</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {alignmentLabel}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {!hasData ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <Target className="mx-auto h-12 w-12 text-violet-300" />

            <h2 className="mt-5 text-2xl font-semibold">
              Your career journey is ready to begin
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Complete the resume analysis flow to generate your personalized
              alignment, skill gaps, roadmap, and project recommendations.
            </p>

            <button
              onClick={() => navigate("/upload")}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Start Career Analysis
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Overview */}
            <div className="mb-8">
              <div className="mb-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-300">
                  Overview
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Your progress at a glance
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  icon={<Target className="h-5 w-5" />}
                  label="Role Alignment"
                  value={`${alignment}%`}
                  description={`${matchedSkills} of ${totalSkills} skills matched`}
                  accent="violet"
                />

                <StatCard
                  icon={<BookOpen className="h-5 w-5" />}
                  label="Roadmap Progress"
                  value={`${roadmapProgress}%`}
                  description={`${completedWeeks} of ${roadmapWeeks.length} weeks`}
                  accent="cyan"
                />

                <StatCard
                  icon={<Flame className="h-5 w-5" />}
                  label="Learning Streak"
                  value="1 day"
                  description="Keep learning to build momentum"
                  accent="amber"
                />

                <StatCard
                  icon={<Trophy className="h-5 w-5" />}
                  label="Skills Ready"
                  value={`${matchedSkills}`}
                  description={`${partialSkills} partial · ${missingSkills} missing`}
                  accent="emerald"
                />
              </div>
            </div>

            {/* Alignment + Roadmap */}
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              {/* Alignment */}
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-300">
                      Role alignment
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Based on your selected role requirements
                    </p>
                  </div>

                  <div className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs text-violet-300">
                    Estimate
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row">
                  <div
                    className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(#8b5cf6 ${alignment}%, rgba(255,255,255,0.08) ${alignment}% 100%)`,
                    }}
                  >
                    <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-slate-950 shadow-inner">
                      <span className="text-4xl font-semibold tracking-tight">
                        {alignment}%
                      </span>
                      <span className="mt-1 text-[11px] text-slate-500">
                        alignment
                      </span>
                    </div>
                  </div>

                  <div className="w-full space-y-3">
                    <LegendRow
                      label="Matched"
                      value={matchedSkills}
                      description="Meets required level"
                    />
                    <LegendRow
                      label="Partial"
                      value={partialSkills}
                      description="Needs improvement"
                    />
                    <LegendRow
                      label="Missing"
                      value={missingSkills}
                      description="Not detected"
                    />
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <div className="flex items-start gap-3">
                    <Target className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                    <p className="text-xs leading-5 text-slate-400">
                      This is a skill-alignment estimate based on the evidence
                      available in your resume. It is not a hiring prediction.
                    </p>
                  </div>
                </div>
              </section>

              {/* Roadmap */}
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-300">
                      Personalized roadmap
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Generated from your identified skill gaps
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                    <Clock3 className="h-5 w-5 text-cyan-300" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      Overall progress
                    </span>
                    <span className="font-semibold text-white">
                      {roadmapProgress}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all"
                      style={{ width: `${roadmapProgress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  {roadmapWeeks.slice(0, 4).map((week, index) => {
                    const completed = index < completedWeeks;
                    const current = index === completedWeeks;

                    return (
                      <div
                        key={week.week}
                        className={`relative flex items-center gap-3 rounded-2xl border p-4 transition ${
                          current
                            ? "border-violet-400/20 bg-violet-400/[0.05]"
                            : "border-white/10 bg-white/[0.025]"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            completed
                              ? "bg-emerald-400/10 text-emerald-300"
                              : current
                                ? "bg-violet-400/10 text-violet-300"
                                : "bg-white/5 text-slate-400"
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <span className="text-xs font-semibold">
                              W{week.week}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">
                            {week.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {week.modules.length} learning module
                            {week.modules.length === 1 ? "" : "s"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 text-xs ${
                            completed
                              ? "text-emerald-300"
                              : current
                                ? "text-violet-300"
                                : "text-slate-500"
                          }`}
                        >
                          {completed
                            ? "Completed"
                            : current
                              ? "Current"
                              : "Upcoming"}
                        </span>
                      </div>
                    );
                  })}

                  {roadmapWeeks.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No roadmap data available yet.
                    </p>
                  )}
                </div>

                {nextRoadmapWeek && (
                  <div className="mt-5 flex items-center justify-between rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] px-4 py-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-cyan-300">
                        Next milestone
                      </p>
                      <p className="mt-1 text-sm font-medium text-white">
                        {nextRoadmapWeek.title}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate("/roadmap")}
                      className="text-xs font-medium text-cyan-300 transition hover:text-cyan-200"
                    >
                      View roadmap →
                    </button>
                  </div>
                )}
              </section>
            </div>

            {/* Project */}
            <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-xl shadow-black/10">
              <div className="border-b border-white/10 bg-gradient-to-r from-violet-500/[0.06] to-cyan-500/[0.04] p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-400/10 ring-1 ring-violet-400/20">
                      <Code2 className="h-6 w-6 text-violet-300" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-violet-300">
                        Current project
                      </p>

                      <h2 className="mt-2 text-2xl font-semibold">
                        {projectData?.project?.title || "No project selected"}
                      </h2>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                        {projectData?.project?.description ||
                          "Choose a recommended project to start applying your new skills."}
                      </p>
                    </div>
                  </div>

                  <div className="w-full lg:min-w-[240px] lg:max-w-[280px]">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        Project progress
                      </span>
                      <span className="font-semibold text-white">
                        {projectProgress}%
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all"
                        style={{ width: `${projectProgress}%` }}
                      />
                    </div>

                    <button
                      onClick={() => navigate("/projects")}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
                    >
                      View Project
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {projectData?.project?.skills &&
                projectData.project.skills.length > 0 && (
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {projectData.project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>
                        Difficulty:{" "}
                        <span className="text-slate-300">
                          {projectData.project.difficulty}
                        </span>
                      </span>

                      <span>•</span>

                      <span>
                        Estimated time:{" "}
                        <span className="text-slate-300">
                          {projectData.project.estimatedTime}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
            </section>

            {/* Skills */}
            <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/10">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    Skill development
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Progress reflects your current role-alignment state.
                  </p>
                </div>

                <div className="text-xs text-slate-500">
                  {matchedSkills} ready · {partialSkills} developing ·{" "}
                  {missingSkills} to learn
                </div>
              </div>

              {skillProgress.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {skillProgress.map((item) => (
                    <div
                      key={item.skill}
                      className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-white">
                              {item.skill}
                            </span>

                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] ${
                                item.status === "matched"
                                  ? "bg-emerald-400/10 text-emerald-300"
                                  : item.status === "partial"
                                    ? "bg-amber-400/10 text-amber-300"
                                    : "bg-rose-400/10 text-rose-300"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>

                          <p className="mt-1 text-[11px] text-slate-600">
                            {item.current} → {item.required}
                          </p>
                        </div>

                        <span className="text-xs font-medium text-slate-400">
                          {item.progress}%
                        </span>
                      </div>

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full transition-all ${
                            item.status === "matched"
                              ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                              : item.status === "partial"
                                ? "bg-gradient-to-r from-amber-400 to-orange-400"
                                : "bg-gradient-to-r from-rose-400 to-violet-400"
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-sm text-slate-500">
                  No skill tracking data available yet.
                </div>
              )}
            </section>

            {/* Next Action */}
            <section className="relative mt-6 overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-white/[0.03] to-cyan-500/10 p-6 shadow-xl shadow-violet-950/10">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-400/10 ring-1 ring-violet-400/20">
                    <Target className="h-6 w-6 text-violet-300" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-violet-300">
                      Next recommended action
                    </p>

                    <h3 className="mt-2 text-xl font-semibold">
                      {topNextSkill
                        ? `Focus on ${topNextSkill.skill}`
                        : "Keep building your portfolio"}
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                      {topNextSkill
                        ? `${topNextSkill.skill} is currently ${topNextSkill.status}. Use your roadmap modules and project work to strengthen this area.`
                        : "Continue completing roadmap modules and documenting your projects to build stronger evidence."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/roadmap")}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Open Roadmap
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </section>

            {/* Footer actions */}
            <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
              <button
                onClick={() => navigate("/projects")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </button>

              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Return to CareerPilot
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  accent: "violet" | "cyan" | "amber" | "emerald";
}) {
  const accentClasses = {
    violet: "bg-violet-400/10 text-violet-300 ring-violet-400/10",
    cyan: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/10",
    amber: "bg-amber-400/10 text-amber-300 ring-amber-400/10",
    emerald: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/10",
  };

  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.045]">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${accentClasses[accent]}`}
        >
          {icon}
        </div>

        <span className="text-xs text-slate-500">{label}</span>
      </div>

      <p className="mt-5 text-3xl font-semibold tracking-tight">{value}</p>

      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function LegendRow({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
      <div>
        <p className="text-sm text-slate-300">{label}</p>
        <p className="text-[10px] text-slate-600">{description}</p>
      </div>

      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}