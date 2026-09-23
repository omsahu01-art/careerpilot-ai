import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  CircleX,
  FileText,
  Sparkles,
  Target,
} from "lucide-react";

type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Not detected";

type MatchStatus = "matched" | "partial" | "missing";

type Skill = {
  skill: string;
  level: string;
  confidence: number;
  evidence: string;
  source: string;
};

type StoredResumeData = {
  skills?: Skill[];
};

type Role = {
  id: string;
  title: string;
  description: string;
  skills: string[];
};

type SkillRequirement = {
  skill: string;
  required: SkillLevel;
};

type SkillMatch = {
  skill: string;
  required: SkillLevel;
  current: SkillLevel;
  status: MatchStatus;
  evidence: string;
  confidence: number;
  source: string;
};

const levelScore: Record<SkillLevel, number> = {
  "Not detected": 0,
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

const roleRequirements: Record<string, SkillRequirement[]> = {
  "frontend-developer": [
    { skill: "React", required: "Intermediate" },
    { skill: "JavaScript", required: "Intermediate" },
    { skill: "HTML", required: "Intermediate" },
    { skill: "CSS", required: "Intermediate" },
    { skill: "Git", required: "Intermediate" },
    { skill: "REST APIs", required: "Beginner" },
  ],

  "backend-developer": [
    { skill: "Python", required: "Intermediate" },
    { skill: "SQL", required: "Intermediate" },
    { skill: "REST APIs", required: "Intermediate" },
    { skill: "Git", required: "Intermediate" },
    { skill: "Docker", required: "Intermediate" },
    { skill: "Node.js", required: "Intermediate" },
  ],

  "full-stack-developer": [
    { skill: "React", required: "Intermediate" },
    { skill: "JavaScript", required: "Intermediate" },
    { skill: "Node.js", required: "Intermediate" },
    { skill: "SQL", required: "Intermediate" },
    { skill: "REST APIs", required: "Intermediate" },
    { skill: "Git", required: "Intermediate" },
  ],

  "data-analyst": [
    { skill: "Python", required: "Intermediate" },
    { skill: "SQL", required: "Intermediate" },
    { skill: "Excel", required: "Intermediate" },
    { skill: "Power BI", required: "Intermediate" },
    { skill: "Pandas", required: "Intermediate" },
    { skill: "Statistics", required: "Intermediate" },
  ],

  "data-scientist": [
    { skill: "Python", required: "Intermediate" },
    { skill: "SQL", required: "Intermediate" },
    { skill: "Pandas", required: "Intermediate" },
    { skill: "Machine Learning", required: "Intermediate" },
    { skill: "Statistics", required: "Intermediate" },
    { skill: "Scikit-learn", required: "Intermediate" },
  ],

  "ui-ux-designer": [
    { skill: "Figma", required: "Intermediate" },
    { skill: "UI/UX", required: "Intermediate" },
    { skill: "User Research", required: "Beginner" },
    { skill: "Wireframing", required: "Intermediate" },
    { skill: "Prototyping", required: "Intermediate" },
  ],

  "devops-engineer": [
    { skill: "Linux", required: "Intermediate" },
    { skill: "Git", required: "Intermediate" },
    { skill: "Docker", required: "Intermediate" },
    { skill: "Kubernetes", required: "Beginner" },
    { skill: "AWS", required: "Beginner" },
    { skill: "CI/CD", required: "Beginner" },
  ],

  "mobile-app-developer": [
    { skill: "Java", required: "Intermediate" },
    { skill: "Kotlin", required: "Intermediate" },
    { skill: "Flutter", required: "Intermediate" },
    { skill: "React Native", required: "Intermediate" },
    { skill: "REST APIs", required: "Beginner" },
    { skill: "Git", required: "Intermediate" },
  ],
};

function normalizeSkill(skill: string) {
  return skill.trim().toLowerCase();
}

function normalizeLevel(level: string): SkillLevel {
  const normalized = level.trim().toLowerCase();

  if (normalized === "advanced") {
    return "Advanced";
  }

  if (normalized === "intermediate") {
    return "Intermediate";
  }

  if (normalized === "beginner") {
    return "Beginner";
  }

  return "Not detected";
}

function calculateMatch(
  required: SkillLevel,
  current: SkillLevel
): MatchStatus {
  if (current === "Not detected") {
    return "missing";
  }

  if (levelScore[current] >= levelScore[required]) {
    return "matched";
  }

  return "partial";
}

function StatusBadge({ status }: { status: MatchStatus }) {
  if (status === "matched") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Matched
      </span>
    );
  }

  if (status === "partial") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300">
        <CircleAlert className="h-3.5 w-3.5" />
        Partial
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-300">
      <CircleX className="h-3.5 w-3.5" />
      Missing
    </span>
  );
}

function CurrentLevel({ level }: { level: SkillLevel }) {
  if (level === "Not detected") {
    return <span className="text-slate-600">Not detected</span>;
  }

  if (level === "Advanced") {
    return <span className="text-emerald-300">Advanced</span>;
  }

  if (level === "Intermediate") {
    return <span className="text-cyan-300">Intermediate</span>;
  }

  return <span className="text-amber-300">Beginner</span>;
}

export default function Matching() {
  const navigate = useNavigate();

  const [resumeSkills, setResumeSkills] = useState<Skill[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    const storedResume = sessionStorage.getItem("careerpilot_resume");
    const storedRole = sessionStorage.getItem("careerpilot_role");

    if (storedResume) {
      try {
        const parsedResume: StoredResumeData = JSON.parse(storedResume);

        if (Array.isArray(parsedResume.skills)) {
          setResumeSkills(parsedResume.skills);
        }
      } catch (error) {
        console.error("Could not read resume data:", error);
      }
    }

    if (storedRole) {
      try {
        const parsedRole: Role = JSON.parse(storedRole);
        setSelectedRole(parsedRole);
      } catch (error) {
        console.error("Could not read role data:", error);
      }
    }
  }, []);

  const matches = useMemo<SkillMatch[]>(() => {
    if (!selectedRole) {
      return [];
    }

    const requirements =
      roleRequirements[selectedRole.id] ||
      selectedRole.skills.map((skill) => ({
        skill,
        required: "Intermediate" as SkillLevel,
      }));

    return requirements.map((requirement) => {
      const detectedSkill = resumeSkills.find(
        (resumeSkill) =>
          normalizeSkill(resumeSkill.skill) ===
          normalizeSkill(requirement.skill)
      );

      const current = detectedSkill
        ? normalizeLevel(detectedSkill.level)
        : "Not detected";

      const status = calculateMatch(requirement.required, current);

      return {
        skill: requirement.skill,
        required: requirement.required,
        current,
        status,
        evidence:
          detectedSkill?.evidence ||
          "No supporting evidence found in the uploaded resume.",
        confidence: detectedSkill?.confidence || 0,
        source: detectedSkill?.source || "not detected",
      };
    });
  }, [resumeSkills, selectedRole]);

  const summary = useMemo(() => {
    return {
      matched: matches.filter((item) => item.status === "matched").length,
      partial: matches.filter((item) => item.status === "partial").length,
      missing: matches.filter((item) => item.status === "missing").length,
      total: matches.length,
    };
  }, [matches]);

  const alignmentPreview = useMemo(() => {
    if (matches.length === 0) {
      return 0;
    }

    const score = matches.reduce((total, match) => {
      if (match.status === "matched") {
        return total + 100;
      }

      if (match.status === "partial") {
        return total + 50;
      }

      return total;
    }, 0);

    return Math.round(score / matches.length);
  }, [matches]);

  const handleContinue = () => {
    sessionStorage.setItem(
      "careerpilot_matching",
      JSON.stringify({
        role: selectedRole,
        matches,
        summary,
        alignmentPreview,
      })
    );

    navigate("/alignment");
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
              <CircleAlert className="h-7 w-7 text-amber-300" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Role selection not found
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Please go back and select a target role before continuing to
              skill matching.
            </p>

            <button
              onClick={() => navigate("/role-select")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Select Role
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
            onClick={() => navigate("/role-select")}
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Role Selection
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
              Step 5 of 10
            </span>

            <span className="text-slate-500">50% complete</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[50%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
          </div>
        </div>

        {/* Heading */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-300">
            <Target className="h-3.5 w-3.5" />
            Skill Framework Matching
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            How well do your skills align?
          </h1>

          <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
            We compared the skills detected in your resume with the
            requirements for{" "}
            <span className="font-semibold text-white">
              {selectedRole.title}
            </span>
            .
          </p>
        </div>

        {/* Role summary */}
        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                <Target className="h-6 w-6 text-violet-300" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Target Role
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {selectedRole.title}
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                <p className="text-xs text-emerald-300/70">Matched</p>
                <p className="mt-1 text-xl font-bold text-emerald-300">
                  {summary.matched}
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
                <p className="text-xs text-amber-300/70">Partial</p>
                <p className="mt-1 text-xl font-bold text-amber-300">
                  {summary.partial}
                </p>
              </div>

              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3">
                <p className="text-xs text-rose-300/70">Missing</p>
                <p className="mt-1 text-xl font-bold text-rose-300">
                  {summary.missing}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alignment preview */}
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                <Sparkles className="h-5 w-5 text-cyan-300" />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Evidence-based comparison
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Skills are marked as matched when your detected level meets
                  the target requirement. Skills that are present but below
                  the target level are marked partial. Skills not detected in
                  the resume are marked missing.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-6 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-violet-300">
              Alignment Preview
            </p>

            <p className="mt-2 text-4xl font-bold text-white">
              {alignmentPreview}%
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Based on current skill matching
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="border-b border-slate-800 px-6 py-5">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-slate-400" />

              <div>
                <h2 className="font-semibold text-white">
                  Skill Comparison
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {summary.total} role requirements analyzed
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {matches.map((match) => (
              <div
                key={match.skill}
                className="p-6 transition hover:bg-slate-900"
              >
                <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:items-center">
                  {/* Skill */}
                  <div>
                    <p className="font-semibold text-white">
                      {match.skill}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span>
                        Confidence:{" "}
                        {match.confidence > 0
                          ? `${match.confidence}%`
                          : "N/A"}
                      </span>

                      {match.source !== "not detected" && (
                        <>
                          <span>•</span>
                          <span>{match.source}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Required */}
                  <div>
                    <p className="mb-1 text-xs text-slate-500">
                      Required Level
                    </p>

                    <p className="text-sm font-medium text-slate-200">
                      {match.required}
                    </p>
                  </div>

                  {/* Current */}
                  <div>
                    <p className="mb-1 text-xs text-slate-500">
                      Current Level
                    </p>

                    <p className="text-sm font-medium">
                      <CurrentLevel level={match.current} />
                    </p>
                  </div>

                  {/* Status */}
                  <div className="lg:text-right">
                    <StatusBadge status={match.status} />
                  </div>
                </div>

                {/* Evidence */}
                <div
                  className={`mt-5 rounded-xl border p-4 ${
                    match.status === "missing"
                      ? "border-rose-500/10 bg-rose-500/5"
                      : "border-slate-800 bg-slate-950/40"
                  }`}
                >
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-600">
                    Resume Evidence
                  </p>

                  <p className="text-sm leading-6 text-slate-400">
                    {match.evidence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {matches.length === 0 && (
          <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
            <CircleAlert className="mx-auto h-8 w-8 text-amber-300" />

            <h3 className="mt-4 font-semibold text-white">
              No role requirements available
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              This role does not currently have a configured skill framework.
            </p>
          </div>
        )}

        {/* Bottom actions */}
        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate("/role-select")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-900 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Change Role
          </button>

          <button
            onClick={handleContinue}
            disabled={matches.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to Alignment
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-slate-600">
          This comparison measures alignment with the selected skill
          framework. It is not a hiring probability, hiring decision, or
          employment guarantee.
        </p>
      </div>
    </div>
  );
}