import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Code2,
  Database,
  Layers3,
  Palette,
  Server,
  Smartphone,
  Sparkles,
} from "lucide-react";

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
  icon: React.ElementType;
  skills: string[];
};

const roles: Role[] = [
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    description:
      "Build responsive, interactive, and user-friendly web applications.",
    icon: Code2,
    skills: ["React", "JavaScript", "HTML", "CSS", "Git", "REST APIs"],
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    description:
      "Build APIs, server-side applications, databases, and backend systems.",
    icon: Server,
    skills: ["Python", "SQL", "REST APIs", "Git", "Docker", "Node.js"],
  },
  {
    id: "full-stack-developer",
    title: "Full Stack Developer",
    description:
      "Work across frontend, backend, APIs, databases, and deployment.",
    icon: Layers3,
    skills: ["React", "JavaScript", "Node.js", "SQL", "REST APIs", "Git"],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    description:
      "Turn raw data into insights, dashboards, and business decisions.",
    icon: BarChart3,
    skills: ["Python", "SQL", "Excel", "Power BI", "Pandas", "Statistics"],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    description:
      "Use statistics, machine learning, and data to solve complex problems.",
    icon: Database,
    skills: [
      "Python",
      "SQL",
      "Pandas",
      "Machine Learning",
      "Statistics",
      "Scikit-learn",
    ],
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    description:
      "Design intuitive digital experiences, interfaces, and user journeys.",
    icon: Palette,
    skills: ["Figma", "UI/UX", "User Research", "Wireframing", "Prototyping"],
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    description:
      "Automate infrastructure, deployment, cloud systems, and reliability.",
    icon: Layers3,
    skills: ["Linux", "Git", "Docker", "Kubernetes", "AWS", "CI/CD"],
  },
  {
    id: "mobile-app-developer",
    title: "Mobile App Developer",
    description:
      "Create mobile applications for Android, iOS, and cross-platform environments.",
    icon: Smartphone,
    skills: [
      "Java",
      "Kotlin",
      "Flutter",
      "React Native",
      "REST APIs",
      "Git",
    ],
  },
];

function normalizeSkill(skill: string) {
  return skill.trim().toLowerCase();
}

export default function RoleSelect() {
  const navigate = useNavigate();

  const [selectedRoleId, setSelectedRoleId] = useState("backend-developer");
  const [resumeSkills, setResumeSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const storedResume = sessionStorage.getItem("careerpilot_resume");

    if (!storedResume) {
      return;
    }

    try {
      const parsedResume: StoredResumeData = JSON.parse(storedResume);

      if (Array.isArray(parsedResume.skills)) {
        setResumeSkills(parsedResume.skills);
      }
    } catch (error) {
      console.error("Could not read stored resume data:", error);
    }
  }, []);

  const selectedRole = roles.find((role) => role.id === selectedRoleId);

  const detectedSkillNames = useMemo(() => {
    return new Set(
      resumeSkills.map((skill) => normalizeSkill(skill.skill))
    );
  }, [resumeSkills]);

  const getMatchedSkillCount = (role: Role) => {
    return role.skills.filter((skill) =>
      detectedSkillNames.has(normalizeSkill(skill))
    ).length;
  };

  const handleContinue = () => {
    if (!selectedRole) {
      return;
    }

    sessionStorage.setItem(
      "careerpilot_role",
      JSON.stringify(selectedRole)
    );

    navigate("/matching");
  };

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
            onClick={() => navigate("/skills")}
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Skills
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
              Step 4 of 10
            </span>

            <span className="text-slate-500">40% complete</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[40%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
          </div>
        </div>

        {/* Heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Career Direction
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Choose your target role
          </h1>

          <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
            Select the role you want to prepare for. CareerPilot will compare
            your detected resume skills against the requirements of that role.
          </p>
        </div>

        {/* Resume skill summary */}
        <div className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Your detected skills
              </p>

              <p className="mt-1 text-sm text-slate-500">
                These skills were extracted from your uploaded resume.
              </p>
            </div>

            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              {resumeSkills.length} skills detected
            </div>
          </div>

          {resumeSkills.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {resumeSkills.map((skill) => (
                <div
                  key={skill.skill}
                  className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs text-slate-300"
                >
                  {skill.skill}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
              No resume skills were found. Please go back and upload your
              resume again.
            </div>
          )}
        </div>

        {/* Role Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRoleId === role.id;
            const matchedCount = getMatchedSkillCount(role);

            return (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`group relative rounded-2xl border p-5 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-violet-500/70 bg-violet-500/10 shadow-lg shadow-violet-950/20"
                    : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                {/* Selected check */}
                {isSelected && (
                  <div className="absolute right-4 top-4">
                    <CheckCircle2 className="h-5 w-5 text-violet-400" />
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl transition ${
                    isSelected
                      ? "bg-violet-500/20 text-violet-300"
                      : "bg-slate-800 text-slate-400 group-hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Title */}
                <h2 className="pr-7 text-base font-semibold text-white">
                  {role.title}
                </h2>

                {/* Description */}
                <p className="mt-2 min-h-[60px] text-sm leading-6 text-slate-500">
                  {role.description}
                </p>

                {/* Resume match */}
                <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Resume match
                    </span>

                    <span
                      className={`text-xs font-semibold ${
                        matchedCount > 0
                          ? "text-cyan-300"
                          : "text-slate-500"
                      }`}
                    >
                      {matchedCount}/{role.skills.length}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                      style={{
                        width: `${
                          (matchedCount / role.skills.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Skill chips */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {role.skills.map((skill) => {
                    const hasSkill = detectedSkillNames.has(
                      normalizeSkill(skill)
                    );

                    return (
                      <span
                        key={skill}
                        className={`rounded-md px-2 py-1 text-[11px] ${
                          hasSkill
                            ? "border border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
                            : "border border-slate-800 bg-slate-800/60 text-slate-500"
                        }`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected role preview */}
        {selectedRole && (
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-cyan-500/5 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-violet-300">
                  Selected target role
                </p>

                <h3 className="mt-1 text-xl font-semibold text-white">
                  {selectedRole.title}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {getMatchedSkillCount(selectedRole)} of{" "}
                  {selectedRole.skills.length} required skills were detected
                  in your resume.
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
                <CheckCircle2 className="h-6 w-6 text-violet-300" />
              </div>
            </div>
          </div>
        )}

        {/* Bottom actions */}
        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate("/skills")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-900 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            onClick={handleContinue}
            disabled={!selectedRole || resumeSkills.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to Skill Matching
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-xs text-slate-600">
          Role matching is based on your resume evidence and the selected
          skill framework. It is not a hiring prediction.
        </p>
      </div>
    </div>
  );
}